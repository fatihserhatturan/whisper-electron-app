const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  transcribeFile: (filePath, language) => ipcRenderer.invoke('transcribe-file', filePath, language),
  stopTranscription: () => ipcRenderer.invoke('stop-transcribe'),

  onTranscriptChunk: (cb) => {
    ipcRenderer.removeAllListeners('transcript-chunk');
    ipcRenderer.on('transcript-chunk', (event, chunk) => cb(chunk));
  },

  onTranscriptStderr: (cb) => {
    ipcRenderer.removeAllListeners('transcript-stderr');
    ipcRenderer.on('transcript-stderr', (event, chunk) => cb(chunk));
  },

  onTranscriptEnd: (cb) => {
    ipcRenderer.removeAllListeners('transcript-end');
    ipcRenderer.on('transcript-end', (event, info) => cb(info));
  },

  onTranscriptProgress: (cb) => {
    ipcRenderer.removeAllListeners('transcript-progress');
    ipcRenderer.on('transcript-progress', (event, progress) => cb(progress));
  },

  onAudioDuration: (cb) => {
    ipcRenderer.removeAllListeners('audio-duration');
    ipcRenderer.on('audio-duration', (event, duration) => cb(duration));
  },
  exportTxt: (text) => ipcRenderer.invoke('export-txt', text),
  exportDocx: (text) => ipcRenderer.invoke('export-docx', text)
});
