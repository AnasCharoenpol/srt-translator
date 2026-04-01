import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import Upload from './components/Upload';
import Progress from './components/Progress';
import Result from './components/Result';
import SettingsModal from './components/SettingsModal';
import { parseSrt, toSrt } from './utils/srtParser';
import { translateCues, TranslateConfig } from './utils/translator';

type State = 'idle' | 'translating' | 'complete' | 'error';

const DEFAULT_CONFIG: TranslateConfig = {
  apiKey: '',
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4o-mini',
  sourceLang: 'Thai',
  targetLang: 'English',
  batchSize: 20
};

export default function App() {
  const [state, setState] = useState<State>('idle');
  const [file, setFile] = useState<File | null>(null);
  
  const [config, setConfig] = useState<TranslateConfig>(() => {
    const saved = localStorage.getItem('srt-translator-config');
    return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
  });
  
  const [targetLang, setTargetLang] = useState(config.targetLang);

  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ filename: string; blob: Blob; cuesProcessed: number; warningsCount: number } | null>(null);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 50, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }
      );
    }
  }, []);

  useEffect(() => {
    if (!config.apiKey) {
      setIsSettingsOpen(true);
    }
  }, [config.apiKey]);

  const handleSaveSettings = (newConfig: any) => {
    const fullConfig = { ...config, ...newConfig };
    setConfig(fullConfig);
    setTargetLang(fullConfig.targetLang);
    localStorage.setItem('srt-translator-config', JSON.stringify(fullConfig));
    setIsSettingsOpen(false);
  };

  const handleTranslate = async () => {
    if (!file) return;
    if (!config.apiKey) {
      setError('Please open Settings and enter your API Key first.');
      setIsSettingsOpen(true);
      return;
    }

    setState('translating');
    setError('');

    try {
      setProgress('Reading SRT file...');
      const fileText = await file.text();
      
      setProgress('Parsing cues...');
      const cues = parseSrt(fileText);
      
      if (cues.length === 0) {
        throw new Error('No valid subtitle cues found in file');
      }

      const finalConfig = { ...config, targetLang };
      const translatedCues = await translateCues(cues, finalConfig, (msg) => {
        setProgress(msg);
      });

      setProgress('Generating output SRT...');
      let outputSrt = toSrt(translatedCues);
      
      const warnings = translatedCues.map(c => c.warning).filter(Boolean);
      if (warnings.length > 0) {
        let warningHeader = "# WARNINGS (non-blocking):\n";
        for (const w of warnings.slice(0, 10)) {
          warningHeader += `# - ${w}\n`;
        }
        warningHeader += "#\n\n";
        outputSrt = warningHeader + outputSrt;
      }

      const origName = file.name.replace(/\.srt$/i, '');
      const newFilename = `${origName}.${targetLang}.srt`;
      
      const blob = new Blob([outputSrt], { type: 'text/plain;charset=utf-8' });

      setResult({
        blob,
        filename: newFilename,
        cuesProcessed: translatedCues.length,
        warningsCount: warnings.length
      });
      setState('complete');
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Translation failed');
      setState('error');
    }
  };

  const handleReset = () => {
    setState('idle');
    setFile(null);
    setResult(null);
    setProgress('');
    setError('');
  };

  return (
    <div
      ref={cardRef}
      style={{
        backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.1)',
        position: 'relative'
      }}
    >
      <button 
        onClick={() => setIsSettingsOpen(true)}
        style={{
          position: 'absolute', top: '20px', right: '20px',
          background: 'none', border: 'none', color: '#a1a1aa',
          cursor: 'pointer', fontSize: '20px'
        }}
        title="Settings"
      >
        ⚙️
      </button>

      <h1
        style={{
          fontSize: '32px', fontWeight: 'bold', color: '#fff', marginBottom: '10px',
          textAlign: 'center', background: 'linear-gradient(135deg, #6366f1, #ec4899)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}
      >
        SRT Translator
      </h1>

      <p style={{ fontSize: '14px', color: '#a1a1aa', marginBottom: '30px', textAlign: 'center' }}>
        Translating <b>{config.sourceLang}</b> to any language
      </p>

      {state === 'idle' && (
        <>
          <Upload
            onFileSelect={setFile}
            accept=".srt"
            label="Select SRT file"
          />

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#e4e4e7', marginBottom: '8px', fontWeight: '500' }}>
              Target Language
            </label>
            <input
              type="text"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              placeholder="e.g. Spanish, Japanese, English..."
              style={{
                width: '100%', padding: '10px', fontSize: '14px',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
                backgroundColor: '#0a0a0a', color: '#fff'
              }}
            />
          </div>

          <button
            onClick={handleTranslate}
            disabled={!file}
            style={{
              width: '100%', padding: '14px', fontSize: '16px', fontWeight: 'bold', color: '#fff',
              background: file ? 'linear-gradient(135deg, #6366f1, #ec4899)' : '#3f3f46',
              border: 'none', borderRadius: '8px', cursor: file ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease'
            }}
          >
            Translate
          </button>
        </>
      )}

      {state === 'translating' && <Progress message={progress || 'Processing...'} />}

      {state === 'error' && (
        <>
          <Progress message={error} isError />
          <button
            onClick={handleReset}
            style={{
              width: '100%', padding: '14px', fontSize: '16px', fontWeight: 'bold', color: '#fff',
              background: 'linear-gradient(135deg, #6366f1, #ec4899)', border: 'none', borderRadius: '8px',
              cursor: 'pointer', marginTop: '20px'
            }}
          >
            Try Again
          </button>
        </>
      )}

      {state === 'complete' && result && (
        <Result
          filename={result.filename} blob={result.blob}
          cuesProcessed={result.cuesProcessed} warningsCount={result.warningsCount}
          onReset={handleReset}
        />
      )}

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onSave={handleSaveSettings}
        initialConfig={{
          apiKey: config.apiKey,
          baseUrl: config.baseUrl,
          model: config.model,
          sourceLang: config.sourceLang,
          batchSize: config.batchSize
        }}
      />
    </div>
  );
}
