const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let currentProcesses = {
  ffmpeg: null,
  whisper: null
};

function getFfmpegPath() {
  try {
    const ffmpegStatic = require('ffmpeg-static');
    return ffmpegStatic.replace('app.asar', 'app.asar.unpacked');
  } catch (e) {
    return 'ffmpeg';
  }
}

function getFfprobePath() {
  try {
    const ffprobeStatic = require('ffprobe-static');
    return ffprobeStatic.path.replace('app.asar', 'app.asar.unpacked');
  } catch (e) {
    return 'ffprobe';
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
    icon: path.join(__dirname, 'assets', 'icon.ico')
  });
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  if (!app.isPackaged) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

function runFfmpeg(input, out) {
  return new Promise((resolve, reject) => {
    const ffmpegPath = getFfmpegPath();
    const args = ['-y', '-i', input, '-ar', '16000', '-ac', '1', out];
    const p = spawn(ffmpegPath, args, { windowsHide: true });

    currentProcesses.ffmpeg = p;

    p.stderr.on('data', d => {
    });

    p.on('close', code => {
      currentProcesses.ffmpeg = null;
      if (code === 0) resolve();
      else reject(new Error('ffmpeg failed with code ' + code));
    });

    p.on('error', err => {
      currentProcesses.ffmpeg = null;
      reject(err);
    });
  });
}

function getAudioDuration(filePath) {
  return new Promise((resolve, reject) => {
    const ffprobePath = getFfprobePath();
    const args = ['-i', filePath, '-show_entries', 'format=duration', '-v', 'quiet', '-of', 'csv=p=0'];
    const p = spawn(ffprobePath, args, { windowsHide: true });

    let output = '';
    p.stdout.on('data', d => {
      output += d.toString();
    });

    p.on('close', code => {
      if (code === 0) {
        const duration = parseFloat(output.trim());
        resolve(duration);
      } else {
        reject(new Error('ffprobe failed with code ' + code));
      }
    });

    p.on('error', err => {
      reject(err);
    });
  });
}

function killProcessSafely(p) {
  return new Promise((resolve) => {
    if (!p || p.killed) return resolve(false);

    try {
      p.kill();
    } catch (e) {
      // ignore
    }

    const pid = p.pid;
    setTimeout(() => {
      if (p && !p.killed) {
        try {
          if (process.platform === 'win32' && pid) {
            const killer = spawn('taskkill', ['/PID', String(pid), '/F', '/T']);
            killer.on('close', () => resolve(true));
            killer.on('error', () => resolve(true));
            return;
          }
          p.kill('SIGKILL');
        } catch (e) {
          // ignore
        }
      }
      resolve(true);
    }, 250);
  });
}

ipcMain.handle('dialog:openFile', async () => {
  const res = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Audio', extensions: ['mp3', 'wav', 'm4a', 'ogg', 'flac', 'aac'] }]
  });
  if (res.canceled) return null;
  return res.filePaths[0];
});

ipcMain.handle('stop-transcribe', async (evt) => {
  const ffmpegProc = currentProcesses.ffmpeg;
  const whisperProc = currentProcesses.whisper;
  let stoppedAny = false;

  if (ffmpegProc) {
    await killProcessSafely(ffmpegProc);
    currentProcesses.ffmpeg = null;
    stoppedAny = true;
  }
  if (whisperProc) {
    await killProcessSafely(whisperProc);
    currentProcesses.whisper = null;
    stoppedAny = true;
  }

  BrowserWindow.getAllWindows().forEach(w => {
    try {
      w.webContents.send('transcript-end', { success: false, error: 'stopped by user' });
    } catch (e) {}
  });

  return { stopped: stoppedAny };
});

ipcMain.handle('transcribe-file', async (evt, filePath, language = 'tr') => {
  try {
    const isDev = !app.isPackaged;
    const basePath = isDev
      ? __dirname
      : process.resourcesPath;

    const whisperCliPath = path.join(basePath, 'native', 'whisper-cli.exe');
    const modelPath = path.join(basePath, 'native', 'models', 'ggml-small.bin');

    console.log('Whisper CLI Path:', whisperCliPath);
    console.log('Model Path:', modelPath);
    console.log('Is Packaged:', app.isPackaged);

    if (!fs.existsSync(whisperCliPath)) {
      throw new Error(`whisper-cli bulunamadı: ${whisperCliPath}`);
    }
    if (!fs.existsSync(modelPath)) {
      throw new Error(`Model bulunamadı: ${modelPath}`);
    }

    const tmpDir = app.getPath('temp');
    const base = path.basename(filePath, path.extname(filePath));
    const wavPath = path.join(tmpDir, `${base}-${Date.now()}.wav`);

    let totalDuration = 0;
    try {
      totalDuration = await getAudioDuration(filePath);
      console.log('Audio duration:', totalDuration, 'seconds');
      evt.sender.send('audio-duration', totalDuration);
    } catch (err) {
      console.warn('Could not get audio duration:', err);
    }

    await runFfmpeg(filePath, wavPath);

    return await new Promise((resolve, reject) => {
      const args = language === 'auto'
        ? ['-m', modelPath, '-f', wavPath]
        : ['-m', modelPath, '-f', wavPath, '-l', language];

      const env = Object.assign({}, process.env, { OMP_NUM_THREADS: String(4) });
      const p = spawn(whisperCliPath, args, {
        cwd: path.dirname(whisperCliPath),
        env,
        windowsHide: true,
        shell: false
      });

      currentProcesses.whisper = p;

      let fullText = '';
      let stderr = '';

      p.stdout.on('data', (d) => {
        const s = d.toString();
        fullText += s;

        const timestampMatch = s.match(/\[(\d{2}):(\d{2}):(\d{2})\.\d{3}\s*-->\s*(\d{2}):(\d{2}):(\d{2})\.\d{3}\]/);
        if (timestampMatch && totalDuration > 0) {
          const hours = parseInt(timestampMatch[4]);
          const minutes = parseInt(timestampMatch[5]);
          const seconds = parseInt(timestampMatch[6]);
          const currentTime = hours * 3600 + minutes * 60 + seconds;
          const progress = Math.min(Math.round((currentTime / totalDuration) * 100), 100);

          try {
            evt.sender.send('transcript-progress', progress);
          } catch (e) {}
        }

        try {
          evt.sender.send('transcript-chunk', s);
        } catch (e) {}
      });

      p.stderr.on('data', (d) => {
        const s = d.toString();
        stderr += s;
        try { evt.sender.send('transcript-stderr', s); } catch (e) {}
      });

      p.on('error', (err) => {
        currentProcesses.whisper = null;
        try { fs.unlinkSync(wavPath); } catch (e) {}
        reject(new Error('whisper spawn error: ' + String(err)));
      });

      p.on('close', (code) => {
        currentProcesses.whisper = null;

        try { fs.unlinkSync(wavPath); } catch (e) {}
        if (code === 0) {
          evt.sender.send('transcript-end', { success: true });
          resolve({ success: true, text: fullText });
        } else {
          evt.sender.send('transcript-end', { success: false, error: stderr || ('exit code ' + code) });
          reject(new Error(`whisper exited with code ${code}. stderr:\n${stderr}`));
        }
      });
    });

  } catch (err) {
    console.error('Transcription error:', err);
    return { success: false, error: err.message || String(err) };
  }
});

ipcMain.handle('export-txt', async (evt, text) => {
  try {
    const result = await dialog.showSaveDialog({
      title: 'Metin Dosyası Olarak Kaydet',
      defaultPath: `transkript-${Date.now()}.txt`,
      filters: [
        { name: 'Text Files', extensions: ['txt'] }
      ]
    });

    if (result.canceled) return { success: false, canceled: true };

    fs.writeFileSync(result.filePath, text, 'utf-8');
    return { success: true, path: result.filePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('export-docx', async (evt, text) => {
  try {
    const result = await dialog.showSaveDialog({
      title: 'Word Belgesi Olarak Kaydet',
      defaultPath: `transkript-${Date.now()}.docx`,
      filters: [
        { name: 'Word Documents', extensions: ['docx'] }
      ]
    });

    if (result.canceled) return { success: false, canceled: true };

    const createDocx = (text) => {
      const JSZip = require('jszip');
      const zip = new JSZip();

      zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`);

      zip.folder('_rels').file('.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);

      zip.folder('word').folder('_rels').file('document.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`);

      const escapedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const paragraphs = escapedText.split('\n').map(line =>
        `<w:p><w:r><w:t xml:space="preserve">${line}</w:t></w:r></w:p>`
      ).join('');

      zip.folder('word').file('document.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${paragraphs}
  </w:body>
</w:document>`);

      return zip.generateAsync({ type: 'nodebuffer' });
    };

    const buffer = await createDocx(text);
    fs.writeFileSync(result.filePath, buffer);

    return { success: true, path: result.filePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});
