// main.js
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let currentProcesses = {
  ffmpeg: null,
  whisper: null
};

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    }
  });
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

app.whenReady().then(createWindow);

// --- Helper: ffmpeg convert ---
function runFfmpeg(input, out) {
  return new Promise((resolve, reject) => {
    const args = ['-y', '-i', input, '-ar', '16000', '-ac', '1', out];
    const p = spawn('ffmpeg', args, { windowsHide: true });

    // store reference so we can kill it later
    currentProcesses.ffmpeg = p;

    p.stderr.on('data', d => {
      // ffmpeg logs to stderr
      // console.log('ffmpeg:', d.toString());
    });

    p.on('close', code => {
      // clear ffmpeg ref
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

// --- Helper: Get audio duration ---
function getAudioDuration(filePath) {
  return new Promise((resolve, reject) => {
    const args = ['-i', filePath, '-show_entries', 'format=duration', '-v', 'quiet', '-of', 'csv=p=0'];
    const p = spawn('ffprobe', args, { windowsHide: true });

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
      // first try graceful kill
      p.kill();
    } catch (e) {
      // ignore
    }

    // wait short süre, sonra zorla sonlandır (Windows için taskkill)
    const pid = p.pid;
    setTimeout(() => {
      if (p && !p.killed) {
        try {
          // Windows: taskkill
          if (process.platform === 'win32' && pid) {
            const killer = spawn('taskkill', ['/PID', String(pid), '/F', '/T']);
            killer.on('close', () => resolve(true));
            killer.on('error', () => resolve(true));
            return;
          }
          // Unix-like: kill -9
          p.kill('SIGKILL');
        } catch (e) {
          // ignore
        }
      }
      resolve(true);
    }, 250);
  });
}

// --- IPC: open file dialog ---
ipcMain.handle('dialog:openFile', async () => {
  const res = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Audio', extensions: ['mp3', 'wav', 'm4a', 'ogg'] }]
  });
  if (res.canceled) return null;
  return res.filePaths[0];
});

ipcMain.handle('stop-transcribe', async (evt) => {
  // if no processes, return false
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

  // notify rendererlara işlem iptali
  BrowserWindow.getAllWindows().forEach(w => {
    try {
      w.webContents.send('transcript-end', { success: false, error: 'stopped by user' });
    } catch (e) {}
  });

  return { stopped: stoppedAny };
});

// --- IPC: transcribe file ---
ipcMain.handle('transcribe-file', async (evt, filePath) => {
  try {
    const whisperCliPath = path.join(__dirname, 'native', process.platform === 'win32' ? 'whisper-cli.exe' : 'whisper-cli');
    const modelPath = path.join(__dirname, 'native', 'models', 'ggml-small.bin');

    if (!fs.existsSync(whisperCliPath)) {
      throw new Error(`whisper-cli not found at ${whisperCliPath}.`);
    }
    if (!fs.existsSync(modelPath)) {
      throw new Error(`Model bulunamadı: ${modelPath}.`);
    }

    const tmpDir = app.getPath('temp');
    const base = path.basename(filePath, path.extname(filePath));
    const wavPath = path.join(tmpDir, `${base}-${Date.now()}.wav`);

    // 1) Get audio duration first
    let totalDuration = 0;
    try {
      totalDuration = await getAudioDuration(filePath);
      console.log('Audio duration:', totalDuration, 'seconds');

      // Send total duration to renderer
      evt.sender.send('audio-duration', totalDuration);
    } catch (err) {
      console.warn('Could not get audio duration:', err);
    }

    // 2) convert to wav (ffmpeg)
    await runFfmpeg(filePath, wavPath);

    // 3) spawn whisper-cli and stream stdout chunks to renderer
    return await new Promise((resolve, reject) => {
      const args = ['-m', modelPath, '-f', wavPath, '-l', 'tr'];
      const env = Object.assign({}, process.env, { OMP_NUM_THREADS: String(4) });
      const p = spawn(whisperCliPath, args, {
        cwd: path.dirname(whisperCliPath),
        env,
        windowsHide: true,
        shell: false
      });

      // save reference so stop button can kill it
      currentProcesses.whisper = p;

      let fullText = '';
      let stderr = '';

      p.stdout.on('data', (d) => {
        const s = d.toString();
        fullText += s;

        // Extract timestamp from output to calculate progress
        // Format: [00:01:23.456 --> 00:01:28.789]
        const timestampMatch = s.match(/\[(\d{2}):(\d{2}):(\d{2})\.\d{3}\s*-->\s*(\d{2}):(\d{2}):(\d{2})\.\d{3}\]/);
        if (timestampMatch && totalDuration > 0) {
          // Parse the end timestamp
          const hours = parseInt(timestampMatch[4]);
          const minutes = parseInt(timestampMatch[5]);
          const seconds = parseInt(timestampMatch[6]);
          const currentTime = hours * 3600 + minutes * 60 + seconds;

          // Calculate progress percentage
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
        // clear ref
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
    return { success: false, error: err.message || String(err) };
  }
});
