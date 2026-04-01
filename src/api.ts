/**
 * API client for SRT translation service
 */

export interface TranslateRequest {
  file: File;
  target: 'en' | 'zh-CN';
  batchSize?: number;
  glossary?: File;
}

export interface TranslateResponse {
  blob: Blob;
  filename: string;
  cuesProcessed: number;
  warningsCount: number;
}

export async function translateSRT(
  request: TranslateRequest,
  onProgress?: (message: string) => void
): Promise<TranslateResponse> {
  const formData = new FormData();
  formData.append('file', request.file);
  formData.append('target', request.target);

  if (request.batchSize) {
    formData.append('batch_size', request.batchSize.toString());
  }

  if (request.glossary) {
    formData.append('glossary', request.glossary);
  }

  if (onProgress) {
    onProgress('Uploading file...');
  }

  const response = await fetch('/api/translate', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Translation failed' }));
    throw new Error(error.detail || 'Translation failed');
  }

  const blob = await response.blob();

  // Extract metadata from headers
  const contentDisposition = response.headers.get('Content-Disposition') || '';
  const filenameMatch = contentDisposition.match(/filename="(.+)"/);
  const filename = filenameMatch ? filenameMatch[1] : 'translated.srt';

  const cuesProcessed = parseInt(response.headers.get('X-Cues-Processed') || '0', 10);
  const warningsCount = parseInt(response.headers.get('X-Warnings-Count') || '0', 10);

  if (onProgress) {
    onProgress('Translation complete!');
  }

  return {
    blob,
    filename,
    cuesProcessed,
    warningsCount,
  };
}

export async function checkHealth(): Promise<{ status: string; model: string }> {
  const response = await fetch('/api/health');
  if (!response.ok) {
    throw new Error('Health check failed');
  }
  return response.json();
}
