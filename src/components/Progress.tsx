import React from 'react';

interface ProgressProps {
  message: string;
  isError?: boolean;
}

export default function Progress({ message, isError }: ProgressProps) {
  return (
    <div
      style={{
        padding: '20px',
        borderRadius: '12px',
        backgroundColor: isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)',
        border: `1px solid ${isError ? 'rgba(239, 68, 68, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
        marginBottom: '20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {!isError && (
          <div
            style={{
              width: '20px',
              height: '20px',
              border: '3px solid #6366f1',
              borderTop: '3px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        )}
        <div style={{ fontSize: '14px', color: isError ? '#fca5a5' : '#e4e4e7' }}>
          {message}
        </div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
