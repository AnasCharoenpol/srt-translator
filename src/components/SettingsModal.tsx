import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: { apiKey: string; baseUrl: string; model: string; sourceLang: string; batchSize: number }) => void;
  initialConfig: { apiKey: string; baseUrl: string; model: string; sourceLang: string; batchSize: number };
}

export default function SettingsModal({ isOpen, onClose, onSave, initialConfig }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState(initialConfig.apiKey);
  const [baseUrl, setBaseUrl] = useState(initialConfig.baseUrl);
  const [model, setModel] = useState(initialConfig.model);
  const [sourceLang, setSourceLang] = useState(initialConfig.sourceLang);
  const [batchSize, setBatchSize] = useState(initialConfig.batchSize);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        padding: '30px',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '500px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
      }}>
        <h2 style={{
          color: '#fff',
          marginTop: 0,
          marginBottom: '20px',
          fontWeight: 'bold',
          fontSize: '24px'
        }}>API Settings</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', color: '#a1a1aa', marginBottom: '8px', fontSize: '14px' }}>Source Language</label>
          <input 
            type="text"
            value={sourceLang}
            onChange={e => setSourceLang(e.target.value)}
            placeholder="e.g. Thai, English, Auto..."
            style={{
              width: '100%', padding: '10px',
              backgroundColor: '#0a0a0a', color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', color: '#a1a1aa', marginBottom: '8px', fontSize: '14px' }}>API Key</label>
          <input 
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="sk-..."
            style={{
              width: '100%', padding: '10px',
              backgroundColor: '#0a0a0a', color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', color: '#a1a1aa', marginBottom: '8px', fontSize: '14px' }}>Base URL (Optional)</label>
          <input 
            type="text"
            value={baseUrl}
            onChange={e => setBaseUrl(e.target.value)}
            placeholder="https://api.openai.com/v1"
            style={{
              width: '100%', padding: '10px',
              backgroundColor: '#0a0a0a', color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#a1a1aa', marginBottom: '8px', fontSize: '14px' }}>Model</label>
            <input 
              type="text"
              value={model}
              onChange={e => setModel(e.target.value)}
              placeholder="gpt-4o-mini"
              style={{
                width: '100%', padding: '10px',
                backgroundColor: '#0a0a0a', color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#a1a1aa', marginBottom: '8px', fontSize: '14px' }}>Batch Size</label>
            <input 
              type="number"
              value={batchSize}
              onChange={e => setBatchSize(parseInt(e.target.value) || 20)}
              style={{
                width: '100%', padding: '10px',
                backgroundColor: '#0a0a0a', color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
          <button 
            onClick={onClose}
            style={{
              flex: 1, padding: '12px',
              backgroundColor: 'transparent',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px', cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave({ apiKey, baseUrl, model, sourceLang, batchSize })}
            style={{
              flex: 1, padding: '12px',
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px', cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
