// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  transcribeFile: (filePath) => ipcRenderer.invoke('transcribe-file', filePath),
  stopTranscription: () => ipcRenderer.invoke('stop-transcribe'),
  onTranscriptChunk: (cb) => {
    ipcRenderer.on('transcript-chunk', (event, chunk) => cb(chunk));
  },
  onTranscriptStderr: (cb) => {
    ipcRenderer.on('transcript-stderr', (event, chunk) => cb(chunk));
  },
  onTranscriptEnd: (cb) => {
    ipcRenderer.on('transcript-end', (event, info) => cb(info));
  },
  onTranscriptProgress: (cb) => {
    ipcRenderer.on('transcript-progress', (event, progress) => cb(progress));
  },
  onAudioDuration: (cb) => {
    ipcRenderer.on('audio-duration', (event, duration) => cb(duration));
  }
});
