import React, { useCallback } from 'react';

interface UploadProps {
  onFileSelect: (file: File) => void;
  accept: string;
  label: string;
}

export default function Upload({ onFileSelect, accept, label }: UploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const srtFile = files.find(f => f.name.endsWith('.srt'));

    if (srtFile) {
      setSelectedFile(srtFile);
      onFileSelect(srtFile);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div style={{ marginBottom: '20px' }}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: isDragging ? '2px dashed #6366f1' : '2px dashed rgba(255,255,255,0.2)',
          borderRadius: '12px',
          padding: '40px 20px',
          textAlign: 'center',
          backgroundColor: isDragging ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.05)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileInput}
          style={{ display: 'none' }}
          id="file-input"
        />
        <label htmlFor="file-input" style={{ cursor: 'pointer', display: 'block' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📄</div>
          <div style={{ fontSize: '16px', color: '#e4e4e7', marginBottom: '5px' }}>
            {selectedFile ? selectedFile.name : label}
          </div>
          <div style={{ fontSize: '14px', color: '#a1a1aa' }}>
            Drop your .srt file here or click to browse
          </div>
        </label>
      </div>
    </div>
  );
}
