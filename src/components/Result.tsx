

interface ResultProps {
  filename: string;
  blob: Blob;
  cuesProcessed: number;
  warningsCount: number;
  onReset: () => void;
}

export default function Result({ filename, blob, cuesProcessed, warningsCount, onReset }: ResultProps) {
  const handleDownload = () => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        padding: '30px',
        borderRadius: '12px',
        backgroundColor: 'rgba(255,255,255,0.05)',
        textAlign: 'center',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>

      <h2 style={{ fontSize: '24px', color: '#fff', marginBottom: '10px' }}>
        Translation Complete!
      </h2>

      <div style={{ fontSize: '14px', color: '#a1a1aa', marginBottom: '20px' }}>
        <div>Processed {cuesProcessed} subtitle cues</div>
        {warningsCount > 0 && (
          <div style={{ color: '#fbbf24', marginTop: '5px' }}>
            {warningsCount} CPS warnings (non-blocking)
          </div>
        )}
      </div>

      <button
        onClick={handleDownload}
        style={{
          padding: '12px 30px',
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#fff',
          background: 'linear-gradient(135deg, #6366f1, #ec4899)',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginRight: '10px',
          transition: 'all 0.3s ease',
        }}
        onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #5b5fc7, #be375f)'}
        onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #6366f1, #ec4899)'}
      >
        Download {filename}
      </button>

      <button
        onClick={onReset}
        style={{
          padding: '12px 30px',
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#fff',
          backgroundColor: 'rgba(255,255,255,0.1)',
          border: '2px solid rgba(255,255,255,0.2)',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
        }}
      >
        Translate Another
      </button>
    </div>
  );
}
