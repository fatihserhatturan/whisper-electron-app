# Whisper Transcriber

A desktop application for transcribing audio files to text using OpenAI's Whisper model. Built with Electron, this application runs entirely offline and processes audio files locally on your computer.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🎥 Demo

![Application Demo](./assets/demo.gif)

## 📋 Table of Contents

- [User Guide](#-user-guide)
  - [System Requirements](#system-requirements)
  - [Installation](#installation)
  - [How to Use](#how-to-use)
  - [Supported Languages](#supported-languages)
  - [Supported Audio Formats](#supported-audio-formats)
  - [Features](#features)
  - [Troubleshooting](#troubleshooting)
- [Development Guide](#-development-guide)
  - [Technology Stack](#technology-stack)
  - [Project Structure](#project-structure)
  - [Setup Development Environment](#setup-development-environment)
  - [Building the Application](#building-the-application)
  - [How It Works](#how-it-works)

---

## 📖 User Guide

### System Requirements

- **Operating System**: Windows 10 or later (64-bit)
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: 500MB free space
- **Processor**: Multi-core processor recommended for faster transcription

### Installation

1. Download `Whisper Transcriber Setup 1.0.0.exe`
2. Double-click the installer file
3. Follow the installation wizard steps
4. Click "Finish" to complete installation
5. Launch the application from your desktop shortcut or Start menu

**Note**: You may see a Windows SmartScreen warning on first launch. Click "More info" → "Run anyway" to proceed. This is normal for applications without a code signing certificate.

### How to Use

#### Step 1: Select Audio File
1. Click the **"Select Audio File"** button
2. Browse and select your audio file (MP3, WAV, M4A, OGG, FLAC, or AAC)
3. The selected file path will be displayed below the button

#### Step 2: Choose Transcription Language
1. Use the language dropdown menu to select the audio language
2. Default is set to Turkish
3. You can also select **"Auto Detect"** to let the AI detect the language automatically
4. Supported languages include: Turkish, English, German, Spanish, French, Italian, Portuguese, Russian, Arabic, Chinese, Japanese, Korean, and more

#### Step 3: Start Transcription
1. Click the **"Transcribe"** button
2. A progress bar will appear showing the transcription progress
3. Transcribed text will appear in real-time in the output box below
4. You can stop the process at any time by clicking the **"Stop"** button

#### Step 4: Export Results
Once transcription is complete, two export options will appear:
- **"Save as TXT"**: Export as plain text file (.txt)
- **"Save as Word"**: Export as Microsoft Word document (.docx)

Click your preferred format, choose a save location, and your transcription will be saved.

### Supported Languages

The application supports over 50 languages including:
- English, Turkish, German, Spanish, French, Italian
- Portuguese, Russian, Arabic, Chinese, Japanese, Korean
- Dutch, Polish, Swedish, Finnish, Danish, Norwegian
- And many more...

### Supported Audio Formats

- MP3 (.mp3)
- WAV (.wav)
- M4A (.m4a)
- OGG (.ogg)
- FLAC (.flac)
- AAC (.aac)

### Features

✅ **Offline Processing**: All transcription happens locally on your computer. No internet connection required after installation.

✅ **Privacy First**: Your audio files never leave your computer. Complete data privacy.

✅ **Multi-language Support**: Transcribe audio in over 50 languages with high accuracy.

✅ **Real-time Progress**: See transcription progress and preview text as it's being generated.

✅ **Multiple Export Formats**: Save your transcriptions as TXT or DOCX files.

✅ **Dark/Light Theme**: Switch between dark and light themes for comfortable viewing.

✅ **Bilingual Interface**: Toggle between Turkish and English interface languages.

✅ **No External Dependencies**: FFmpeg is bundled with the application - no additional software needed.

### Troubleshooting

#### Application Won't Start
- Make sure you're running Windows 10 or later
- Try running the installer as administrator
- Check if antivirus software is blocking the application

#### Transcription is Slow
- Transcription speed depends on your CPU performance
- Close other resource-intensive applications
- Longer audio files naturally take more time

#### "Whisper-cli not found" Error
- Reinstall the application
- Make sure the installation completed successfully
- Check if antivirus deleted any files

#### Export Not Working
- Make sure you have write permissions in the selected folder
- Try saving to a different location (e.g., Desktop or Documents)

#### Audio File Not Recognized
- Ensure your file is in a supported format
- Try converting your audio to MP3 or WAV format
- Check if the file is corrupted by playing it in a media player

---

## 🛠 Development Guide

### Technology Stack

**Frontend:**
- React 18 (without JSX, using React.createElement)
- Vanilla CSS with CSS Variables for theming
- Custom SVG icons

**Backend:**
- Electron 38.2.1 (Main process)
- Node.js built-in modules (fs, path, child_process)
- IPC (Inter-Process Communication) for renderer-main communication

**Audio Processing:**
- FFmpeg (for audio format conversion)
- FFprobe (for audio metadata extraction)
- Whisper.cpp (C++ implementation of OpenAI's Whisper model)

**Build Tools:**
- Electron Builder (for creating Windows installers)
- NSIS (installer creation)

**Additional Libraries:**
- JSZip (for creating DOCX files)
- ffmpeg-static (bundled FFmpeg binaries)
- ffprobe-static (bundled FFprobe binaries)

### Project Structure

```
whisper-electron-app/
├── main.js                 # Electron main process
├── preload.js             # Preload script (context bridge)
├── package.json           # Project dependencies and build config
├── renderer/              # Frontend files
│   ├── index.html        # Main HTML file
│   ├── styles.css        # Application styles
│   ├── app.js            # Main React application
│   ├── icons.js          # SVG icon components
│   └── translations.js   # i18n translations
├── native/               # Native binaries
│   ├── whisper-cli.exe  # Whisper C++ executable
│   └── models/
│       └── ggml-small.bin # Whisper AI model (small variant)
└── assets/              # Application assets
    └── icon.ico         # Application icon
```

### Setup Development Environment

#### Prerequisites
1. **Node.js** (v16 or later)
2. **npm** (comes with Node.js)
3. **Git** (optional, for version control)

#### Installation Steps

1. **Clone or download the project**
```bash
git clone <repository-url>
cd whisper-electron-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Install FFmpeg static binaries**
```bash
npm install ffmpeg-static ffprobe-static
```

4. **Add Whisper.cpp components** (see detailed guide below)
   - Get Whisper CLI executable
   - Download AI models

5. **Run in development mode**
```bash
npm start
```

### Building the Application

#### Build for Windows

1. **Ensure all dependencies are installed**
```bash
npm install
```

2. **Create assets folder with icon**
```bash
mkdir assets
# Add your icon.ico file to the assets folder
```

3. **Run build command**
```bash
npm run build
```

4. **Output location**
   - Installer: `dist/Whisper Transcriber Setup 1.0.0.exe`
   - Portable: `dist/Whisper Transcriber-1.0.0-portable.exe`

#### Build Configuration

The build process is configured in `package.json`:

```json
"build": {
  "appId": "com.whisper.transcriber",
  "productName": "Whisper Transcriber",
  "win": {
    "target": ["nsis", "portable"],
    "icon": "assets/icon.ico"
  },
  "extraResources": [
    {
      "from": "native",
      "to": "native",
      "filter": ["**/*"]
    }
  ]
}
```

### How It Works

#### Architecture Overview

1. **Main Process (main.js)**
   - Manages application lifecycle
   - Handles file dialogs
   - Spawns child processes (FFmpeg, Whisper)
   - Manages IPC communication with renderer

2. **Renderer Process (app.js)**
   - User interface built with React
   - Sends commands to main process via IPC
   - Receives real-time updates during transcription
   - Manages UI state and theme

3. **Preload Script (preload.js)**
   - Security bridge between main and renderer
   - Exposes safe APIs to renderer process
   - Uses contextBridge for security

#### Transcription Pipeline

1. **File Selection**: User selects an audio file via dialog
2. **Audio Conversion**: FFmpeg converts audio to 16kHz mono WAV
3. **Duration Detection**: FFprobe extracts audio duration for progress tracking
4. **Transcription**: Whisper CLI processes the WAV file
   - Outputs transcribed text chunks in real-time
   - Includes timestamps for progress calculation
5. **Text Display**: Renderer receives chunks and displays progressively
6. **Export**: User can save final text as TXT or DOCX

#### Key Features Implementation

**Real-time Progress Tracking:**
```javascript
// Extracts timestamps from Whisper output
const timestampMatch = s.match(/\[(\d{2}):(\d{2}):(\d{2})\.\d{3}/);
// Calculates progress percentage
const progress = Math.round((currentTime / totalDuration) * 100);
```

**FFmpeg Integration:**
```javascript
// Production: uses bundled static binary
const ffmpegPath = require('ffmpeg-static');
// Converts to optimal format for Whisper
spawn(ffmpegPath, ['-y', '-i', input, '-ar', '16000', '-ac', '1', output]);
```

**DOCX Export:**
```javascript
// Creates valid DOCX using JSZip
// Generates proper OpenXML structure
// No external libraries like docx.js needed
```

**Theme Switching:**
```javascript
// CSS variables for dynamic theming
:root {
  --primary-orange: #ff8c42;
  --bg-light: #ffffff;
  --bg-dark: #1a1a2e;
}
// Body class toggling
document.body.className = theme; // 'light' or 'dark'
```

### Development Tips

- **Hot Reload**: Not available by default. Restart app after code changes.
- **DevTools**: Opens automatically in development mode (`!app.isPackaged`)
- **Console Logs**: Check both main process console and DevTools console
- **Testing**: Test with various audio lengths and formats
- **Model Size**: Using `ggml-small.bin` for balance of speed and accuracy. Other models:
  - `tiny`: Fastest, less accurate (~75MB, 1GB RAM)
  - `base`: Fast, good accuracy (~142MB, 1GB RAM)
  - `small`: Current choice (default) (~466MB, 2GB RAM)
  - `medium`: Slower, better accuracy (~1.5GB, 5GB RAM)
  - `large`: Slowest, best accuracy (~2.9GB, 10GB RAM)

---

## 🔧 Whisper.cpp Integration Guide

This section explains how to obtain and integrate Whisper.cpp components into your project.

### Option 1: Download Pre-built Binaries (Easiest)

#### Step 1: Download Whisper CLI

1. Go to [Whisper.cpp GitHub Releases](https://github.com/ggerganov/whisper.cpp/releases)
2. Find the latest release
3. Download the appropriate binary for Windows:
   - Look for `whisper-bin-x64.zip` or similar Windows x64 binary
4. Extract the archive
5. Locate `main.exe` (this is the CLI executable)
6. Rename `main.exe` to `whisper-cli.exe`
7. Place it in your project's `native/` folder

#### Step 2: Download AI Models

**From Hugging Face (Recommended):**

1. Visit [Whisper.cpp on Hugging Face](https://huggingface.co/ggerganov/whisper.cpp)
2. Navigate to the "Files and versions" tab
3. Download your preferred model:
   - `ggml-tiny.bin` (75 MB) - Fastest
   - `ggml-base.bin` (142 MB) - Fast & Good
   - `ggml-small.bin` (466 MB) - **Recommended** (Default)
   - `ggml-medium.bin` (1.5 GB) - High accuracy
   - `ggml-large-v3.bin` (2.9 GB) - Best accuracy

4. Create `native/models/` folder in your project
5. Place the downloaded model file inside

**Direct Download Links:**
```bash
# Using curl or wget
cd native/models/

# Tiny model
curl -L -o ggml-tiny.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.bin

# Base model
curl -L -o ggml-base.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin

# Small model (recommended)
curl -L -o ggml-small.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin

# Medium model
curl -L -o ggml-medium.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-medium.bin

# Large model
curl -L -o ggml-large-v3.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3.bin
```

**Using PowerShell:**
```powershell
# Create directories
New-Item -ItemType Directory -Force -Path "native\models"

# Download small model (recommended)
Invoke-WebRequest -Uri "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin" -OutFile "native\models\ggml-small.bin"
```

### Option 2: Build Whisper.cpp from Source (Advanced)

If you want the latest version or need to customize the build:

#### Prerequisites
- Visual Studio 2019 or later (with C++ development tools)
- CMake (3.10 or later)
- Git

#### Build Steps

1. **Clone Whisper.cpp repository**
```bash
git clone https://github.com/ggerganov/whisper.cpp.git
cd whisper.cpp
```

2. **Build with CMake (Windows)**
```bash
# Create build directory
mkdir build
cd build

# Configure with CMake
cmake ..

# Build the project
cmake --build . --config Release
```

3. **Locate the executable**
   - After building, find `main.exe` in `build/bin/Release/`
   - This is your Whisper CLI executable

4. **Copy to your project**
```bash
# Copy the executable
copy build\bin\Release\main.exe ..\whisper-electron-app\native\whisper-cli.exe
```

5. **Download models** (same as Option 1)

#### Building with GPU Support (Optional)

For CUDA (NVIDIA GPU) support:

```bash
# Configure with CUDA support
cmake .. -DWHISPER_CUBLAS=ON

# Build
cmake --build . --config Release
```

For OpenCL support:
```bash
cmake .. -DWHISPER_CLBLAST=ON
cmake --build . --config Release
```

### Switching Models in Your Application

To allow users to switch between different models:

#### Method 1: Modify main.js

Change the model path in `main.js`:

```javascript
// Current (small model)
const modelPath = path.join(basePath, 'native', 'models', 'ggml-small.bin');

// Change to tiny for faster processing
const modelPath = path.join(basePath, 'native', 'models', 'ggml-tiny.bin');

// Change to medium for better accuracy
const modelPath = path.join(basePath, 'native', 'models', 'ggml-medium.bin');
```

#### Method 2: Add Model Selection UI (Advanced)

Add a model selector to your UI:

**1. Update translations.js:**
```javascript
const translations = {
  tr: {
    // ... existing translations
    modelSelection: 'Model Seçimi',
    modelTiny: 'Tiny (Hızlı)',
    modelBase: 'Base (Dengeli)',
    modelSmall: 'Small (Önerilen)',
    modelMedium: 'Medium (Yüksek Kalite)',
  },
  en: {
    // ... existing translations
    modelSelection: 'Model Selection',
    modelTiny: 'Tiny (Fast)',
    modelBase: 'Base (Balanced)',
    modelSmall: 'Small (Recommended)',
    modelMedium: 'Medium (High Quality)',
  }
};

const availableModels = [
  { code: 'tiny', name: { tr: 'Tiny (Hızlı)', en: 'Tiny (Fast)' }, file: 'ggml-tiny.bin' },
  { code: 'base', name: { tr: 'Base (Dengeli)', en: 'Base (Balanced)' }, file: 'ggml-base.bin' },
  { code: 'small', name: { tr: 'Small (Önerilen)', en: 'Small (Recommended)' }, file: 'ggml-small.bin' },
  { code: 'medium', name: { tr: 'Medium (Yüksek)', en: 'Medium (High Quality)' }, file: 'ggml-medium.bin' },
];
```

**2. Update app.js:**
```javascript
const [selectedModel, setSelectedModel] = useState('small');

// Add model selector in render
React.createElement('div', { className: 'model-selector' },
  React.createElement('label', { className: 'model-label' },
    React.createElement(Icons.Cpu),
    t.modelSelection
  ),
  React.createElement('select', {
    className: 'model-select',
    value: selectedModel,
    onChange: (e) => setSelectedModel(e.target.value),
    disabled: busy
  },
    availableModels.map(model =>
      React.createElement('option', {
        key: model.code,
        value: model.code
      }, model.name[language])
    )
  )
)

// Pass model to transcribeFile
await window.electronAPI.transcribeFile(file, transcriptionLang, selectedModel);
```

**3. Update preload.js:**
```javascript
transcribeFile: (filePath, language, model) =>
  ipcRenderer.invoke('transcribe-file', filePath, language, model),
```

**4. Update main.js:**
```javascript
ipcMain.handle('transcribe-file', async (evt, filePath, language = 'tr', modelType = 'small') => {
  try {
    const isDev = !app.isPackaged;
    const basePath = isDev ? __dirname : process.resourcesPath;

    const whisperCliPath = path.join(basePath, 'native', 'whisper-cli.exe');

    // Map model type to filename
    const modelFiles = {
      'tiny': 'ggml-tiny.bin',
      'base': 'ggml-base.bin',
      'small': 'ggml-small.bin',
      'medium': 'ggml-medium.bin',
      'large': 'ggml-large-v3.bin'
    };

    const modelFile = modelFiles[modelType] || 'ggml-small.bin';
    const modelPath = path.join(basePath, 'native', 'models', modelFile);

    console.log('Using model:', modelFile);

    if (!fs.existsSync(modelPath)) {
      throw new Error(`Model not found: ${modelPath}`);
    }

    // ... rest of the code
  }
});
```

### Model Comparison Chart

| Model | Size | RAM | Speed | Accuracy | Use Case |
|-------|------|-----|-------|----------|----------|
| Tiny | 75MB | ~1GB | ⚡⚡⚡⚡⚡ | ⭐⭐⭐ | Quick drafts, real-time |
| Base | 142MB | ~1GB | ⚡⚡⚡⚡ | ⭐⭐⭐⭐ | General use |
| Small | 466MB | ~2GB | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ | **Recommended default** |
| Medium | 1.5GB | ~5GB | ⚡⚡ | ⭐⭐⭐⭐⭐⭐ | Professional transcription |
| Large | 2.9GB | ~10GB | ⚡ | ⭐⭐⭐⭐⭐⭐⭐ | Maximum accuracy |

### Testing Models

After adding models, test them:

```bash
# Run in development
npm start

# Test with a short audio file first
# Compare accuracy and speed between models
# Check memory usage in Task Manager
```

### Troubleshooting Model Issues

**"Model not found" error:**
- Verify file name matches exactly (case-sensitive on some systems)
- Check if model file was fully downloaded (compare file size)
- Ensure `native/models/` directory exists

**Out of memory error:**
- Switch to a smaller model (tiny or base)
- Close other applications
- Increase virtual memory in Windows

**Slow transcription:**
- Use a smaller model (tiny or base)
- Check CPU usage - close background apps
- Consider building with GPU support for faster processing

### Updating Whisper.cpp

To update to a newer version:

1. Check [Whisper.cpp releases](https://github.com/ggerganov/whisper.cpp/releases) for updates
2. Download new `whisper-cli.exe` (or rebuild from source)
3. Replace the old executable in `native/` folder
4. Test with existing models (usually compatible)
5. Re-download models if format changed
6. Rebuild your Electron app: `npm run build`

---

### Common Development Issues

**Module not found errors:**
```bash
npm install
```

**Build fails with permission errors:**
- Run PowerShell as Administrator
- Or enable Windows Developer Mode

**FFmpeg not working:**
- Ensure ffmpeg-static is installed
- Check paths in main.js

**Whisper CLI not found:**
- Verify `native/whisper-cli.exe` exists
- Check `native/models/ggml-small.bin` exists

---

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📧 Support

For support, please contact: [fatihserhatturan@gmail.com]

---

**Built with ❤️ using Electron and Whisper.cpp**
