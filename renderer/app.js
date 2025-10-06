// app.js
const { useState, useEffect, useRef } = React;

function App() {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('tr');
  const [transcriptionLang, setTranscriptionLang] = useState('tr');
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [transcriptionComplete, setTranscriptionComplete] = useState(false);
  const textRef = useRef('');

  const t = translations[language];

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    const handleTranscriptChunk = (chunk) => {
      const cleanChunk = chunk.replace(/\[\d{2}:\d{2}:\d{2}\.\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}\.\d{3}\]\s*/g, '');

      if (cleanChunk.trim()) {
        textRef.current += cleanChunk;
        setText(textRef.current);
      }
    };

    const handleTranscriptStderr = (chunk) => {
      const progressMatch = chunk.match(/progress\s*=\s*(\d+)%/);
      if (progressMatch) {
        const percent = parseInt(progressMatch[1]);
        setProgress(percent);
      }

      console.log('whisper process info:', chunk);
    };

    const handleTranscriptEnd = (info) => {
      setBusy(false);
      setProgress(0);
      if (textRef.current && textRef.current.trim()) {
        setTranscriptionComplete(true);
      }
    };

    window.electronAPI.onTranscriptChunk(handleTranscriptChunk);
    window.electronAPI.onTranscriptStderr(handleTranscriptStderr);
    window.electronAPI.onTranscriptEnd(handleTranscriptEnd);

  }, []);

  async function pickFile() {
    const p = await window.electronAPI.openFile();
    if (p) {
      setFile(p);
      setText('');
      textRef.current = '';
      setTranscriptionComplete(false);
    }
  }

  async function transcribe() {
    if (!file) return alert(t.selectFileFirst);
    setBusy(true);
    setText('');
    setProgress(0);
    setTranscriptionComplete(false);
    textRef.current = '';
    try {
      await window.electronAPI.transcribeFile(file, transcriptionLang);
    } catch (err) {
      setBusy(false);
      setProgress(0);
      alert(t.unexpectedError + ': ' + err);
    }
  }

  async function stop() {
    await window.electronAPI.stopTranscription();
    setBusy(false);
    setProgress(0);
    if (text && text.trim()) {
      setTranscriptionComplete(true);
    }
  }

  async function exportAsTxt() {
    try {
      const result = await window.electronAPI.exportTxt(text);
      if (result.success) {
        alert(t.exportSuccess + '\n' + result.path);
      } else if (!result.canceled) {
        alert(t.exportError + ': ' + result.error);
      }
    } catch (err) {
      alert(t.exportError + ': ' + err);
    }
  }

  async function exportAsDocx() {
    try {
      const result = await window.electronAPI.exportDocx(text);
      if (result.success) {
        alert(t.exportSuccess + '\n' + result.path);
      } else if (!result.canceled) {
        alert(t.exportError + ': ' + result.error);
      }
    } catch (err) {
      alert(t.exportError + ': ' + err);
    }
  }

  return React.createElement('div', { className: 'app-container' },
    React.createElement('div', { className: 'toolbar' },
      React.createElement('div', { className: 'toolbar-left' },
        React.createElement('div', { className: 'app-title' },
          React.createElement(Icons.Mic),
          t.appTitle
        )
      ),
      React.createElement('div', { className: 'toolbar-right' },
        React.createElement('div', { className: 'switch-container' },
          React.createElement('span', { className: 'switch-icon' }, '🇹🇷'),
          React.createElement('label', { className: 'switch' },
            React.createElement('input', {
              type: 'checkbox',
              checked: language === 'en',
              onChange: (e) => setLanguage(e.target.checked ? 'en' : 'tr')
            }),
            React.createElement('span', { className: 'slider' })
          ),
          React.createElement('span', { className: 'switch-icon' }, '🇬🇧')
        ),
        React.createElement('div', { className: 'switch-container' },
          React.createElement(Icons.Sun),
          React.createElement('label', { className: 'switch' },
            React.createElement('input', {
              type: 'checkbox',
              checked: theme === 'dark',
              onChange: (e) => setTheme(e.target.checked ? 'dark' : 'light')
            }),
            React.createElement('span', { className: 'slider' })
          ),
          React.createElement(Icons.Moon)
        )
      )
    ),

    React.createElement('div', { className: 'main-content' },
      React.createElement('div', { className: 'card' },
        React.createElement('div', { className: 'file-selector' },
          React.createElement('button', {
            className: 'file-button',
            onClick: pickFile,
            disabled: busy
          },
            React.createElement(Icons.Upload),
            t.selectFile
          ),
          file && React.createElement('div', { className: 'file-info' },
            React.createElement(Icons.File),
            file
          )
        ),

        React.createElement('div', { className: 'language-selector' },
  React.createElement('label', { className: 'language-label' },
    React.createElement(Icons.Globe),
    t.transcriptionLanguage
  ),
  React.createElement('select', {
    className: 'language-select',
    value: transcriptionLang,
    onChange: (e) => setTranscriptionLang(e.target.value),
    disabled: busy
  },
    supportedLanguages.map(lang =>
      React.createElement('option', {
        key: lang.code,
        value: lang.code
      }, lang.name[language])
    )
  )
),

        React.createElement('div', { className: 'action-buttons' },
          React.createElement('button', {
            className: 'action-button primary',
            onClick: transcribe,
            disabled: busy || !file
          },
            busy ? React.createElement(Icons.Loader) : React.createElement(Icons.Play),
            busy ? t.transcribing : t.transcribe
          ),
          React.createElement('button', {
            className: 'action-button danger',
            onClick: stop,
            disabled: !busy
          },
            React.createElement(Icons.Stop),
            t.stop
          )
        ),

        React.createElement('div', { className: 'progress-container' + (busy ? ' active' : '') },
          React.createElement('div', { className: 'progress-bar' },
            React.createElement('div', {
              className: 'progress-fill',
              style: { width: progress + '%' }
            })
          ),
          React.createElement('div', { className: 'progress-text' },
            progress > 0 ? progress + '%' : t.transcribing + '...'
          )
        ),

        React.createElement('div', { className: 'output-section' },
          React.createElement('div', { className: 'output-header' },
            React.createElement(Icons.FileText),
            t.output
          ),
          React.createElement('div', { className: 'output-box' },
            text || React.createElement('div', { className: 'empty-state' }, t.emptyOutput)
          )
        ),

        React.createElement('div', { className: 'export-section' + (transcriptionComplete && text ? ' visible' : '') },
          React.createElement('div', { className: 'export-buttons' },
            React.createElement('button', {
              className: 'export-button',
              onClick: exportAsTxt,
              disabled: !text
            },
              React.createElement(Icons.Download),
              t.exportTxt
            ),
            React.createElement('button', {
              className: 'export-button',
              onClick: exportAsDocx,
              disabled: !text
            },
              React.createElement(Icons.Download),
              t.exportDocx
            )
          )
        )
      )
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
