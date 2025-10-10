# Whisper Desktop Transcriber

A cross-platform desktop application for offline audio transcription using OpenAI's Whisper model. Built with Electron and whisper.cpp, this application processes audio files entirely on your local machine without requiring an internet connection or external API calls.

![Application Demo](./assets/demo.gif)

[**⬇️ Download for Windows (Setup.exe)**](https://github.com/fatihserhatturan/whisper-local-transcriber-app/releases/tag/v1.0.0.1)
## Overview

This project bridges the gap between powerful AI speech recognition technology and user-friendly desktop applications. By leveraging whisper.cpp - a lightweight C++ implementation of OpenAI's Whisper model - the application provides professional-grade transcription capabilities while maintaining complete data privacy and eliminating recurring API costs.


## Technical Architecture

### Core Components

**Frontend Layer**
- React 18 with vanilla JavaScript (no JSX compilation required)
- CSS Variables for dynamic theming
- Custom SVG icon system
- Bilingual interface (Turkish/English)

**Backend Layer**
- Electron main process for system integration
- Node.js native modules for file operations
- Child process management for FFmpeg and Whisper
- IPC channels for real-time progress updates

**Audio Processing Pipeline**
1. File selection via native dialog
2. Format conversion to 16kHz mono WAV using FFmpeg
3. Duration extraction via FFprobe for progress tracking
4. Transcription via whisper.cpp executable
5. Real-time text streaming to UI
6. Export to TXT or DOCX formats

### Technology Stack

**Runtime Environment**
- Node.js with Electron 38.2.1
- whisper.cpp (C++ implementation of Whisper)
- FFmpeg/FFprobe (bundled static binaries)

**Development Tools**
- Electron Builder for packaging
- NSIS for Windows installer creation
- JSZip for DOCX generation
- Transliteration for filename sanitization

## Development Setup

### Prerequisites

- Node.js 16 or later
- npm package manager
- Windows 10+ (for Windows builds)
- Visual Studio Build Tools (for native compilation)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/whisper-electron-app.git
cd whisper-electron-app

# Install dependencies
npm install

# Install FFmpeg static binaries
npm install ffmpeg-static ffprobe-static

# Run in development mode
npm start
```

### Project Structure

```
whisper-electron-app/
├── main.js                 # Electron main process
├── preload.js             # IPC security bridge
├── package.json           # Dependencies and build config
├── renderer/              # Frontend application
│   ├── index.html
│   ├── app.js            # React application
│   ├── styles.css        # Theme-aware styling
│   ├── icons.js          # SVG components
│   └── translations.js   # i18n support
├── native/               # Native binaries
│   ├── whisper-cli.exe
│   └── models/
│       └── *.bin        # Whisper model files
└── assets/
    └── icon.ico
```

## Building from Source

### Windows Build

```bash
# Install all dependencies
npm install

# Build application
npm run build
```

The build output will be in the `dist/` directory:
- `FST.cpp Setup 1.0.0.exe` - Full installer
- `FST.cpp-1.0.0-portable.exe` - Portable version

### Build Configuration

The application uses Electron Builder with NSIS for Windows installations. Key configuration includes:
- ASAR archive with unpacked native binaries
- Code signing support (certificate required)
- Custom installer UI with license agreement
- Desktop and start menu shortcut creation

## Whisper.cpp Integration

This application uses whisper.cpp as its transcription engine. For comprehensive information about:
- Model variants and performance characteristics
- GPU acceleration options (CUDA, Metal, OpenCL)
- Advanced compilation flags
- Platform-specific optimizations
- Model conversion and quantization

Please refer to the official whisper.cpp repository:
**https://github.com/ggml-org/whisper.cpp**

### Quick Start with Models

Download pre-converted models from Hugging Face:
```bash
# Example: Download small model (recommended default)
curl -L -o native/models/ggml-small.bin \
  https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin
```

Available model sizes:
- tiny (75MB) - Fast, basic accuracy
- base (142MB) - Good balance
- small (466MB) - Recommended default
- medium (1.5GB) - High accuracy
- large (2.9GB) - Maximum accuracy

## Development Considerations

### Performance Optimization

**CPU Utilization**
The application limits Whisper to 4 threads by default via `OMP_NUM_THREADS`. Adjust based on your target hardware:
```javascript
const env = Object.assign({}, process.env, { 
  OMP_NUM_THREADS: String(4) 
});
```

**Memory Management**
- Model files are memory-mapped during inference
- Temporary WAV files are automatically cleaned up
- Process termination is handled gracefully





### Model Selection UI

The application currently uses the small model by default. To implement model selection:
1. Add model dropdown in renderer
2. Pass model selection to transcription handler
3. Map model types to file paths in main process


## Related Projects

For more advanced features or different use cases, explore these whisper.cpp-based projects:
- WhisperScript - Professional transcription with speaker detection
- OBS Studio Plugin - Real-time caption generation
- Mobile implementations for iOS and Android



---

**Built with Electron and whisper.cpp**
