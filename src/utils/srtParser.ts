export interface Cue {
  id: number;
  start: string;
  end: string;
  text: string;
  warning?: string;
}

/**
 * Parses SRT text into an array of Cue objects.
 */
export function parseSrt(srtText: string): Cue[] {
  // Normalize line endings to \n
  const text = srtText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  if (!text) return [];

  const blocks = text.split(/\n{2,}/);
  const cues: Cue[] = [];

  for (const block of blocks) {
    const lines = block.split('\n');
    if (lines.length < 3) continue;

    const idStr = lines[0].trim();
    const idMatch = idStr.match(/\d+/);
    if (!idMatch) continue;
    const id = parseInt(idMatch[0], 10);

    const timecodeLine = lines[1].trim();
    const timeParts = timecodeLine.split('-->');
    if (timeParts.length !== 2) continue;
    
    const start = timeParts[0].trim();
    const end = timeParts[1].trim();

    const textLines = lines.slice(2).map(l => l.trim()).filter(l => l.length > 0);
    const textContent = textLines.join('\n');

    cues.push({
      id,
      start,
      end,
      text: textContent
    });
  }

  return cues;
}

/**
 * Converts an array of Cue objects back into SRT text.
 */
export function toSrt(cues: Cue[]): string {
  return cues.map(cue => {
    return `${cue.id}\n${cue.start} --> ${cue.end}\n${cue.text}`;
  }).join('\n\n') + '\n';
}

/**
 * Helper to check characters per second (CPS)
 */
export function countReadingSpeed(text: string, startCode: string, endCode: string): string | undefined {
  const parseTime = (tc: string) => {
    const parts = tc.split(':');
    if (parts.length !== 3) return 0;
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const sParts = parts[2].split(',');
    const s = parseInt(sParts[0], 10);
    const ms = sParts.length > 1 ? parseInt(sParts[1], 10) : 0;
    return (h * 3600) + (m * 60) + s + (ms / 1000);
  };

  const start = parseTime(startCode);
  const end = parseTime(endCode);
  const duration = end - start;
  
  if (duration <= 0) return undefined;
  
  const cps = text.length / duration;
  if (cps > 20) {
    return `High reading speed (${cps.toFixed(1)} chars/sec)`;
  }
  return undefined;
}
