import { Cue, countReadingSpeed } from './srtParser';

export interface TranslateConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  sourceLang: string;
  targetLang: string;
  batchSize: number;
}

const buildSystemPrompt = (source: string, target: string) => {
  return `You are a professional subtitle translator. Translate ${source || 'the'} subtitles into ${target}.

You must respond with valid JSON format.

⚠️ CRITICAL REQUIREMENTS - FAILURE TO FOLLOW WILL RESULT IN ERROR ⚠️

1. EXACT COUNT MATCHING:
   - You will receive a field "expected_output_count" in the input
   - You MUST return EXACTLY that many translations
   - NO EXCEPTIONS, NO MERGING, NO SKIPPING

2. EXACT ID PRESERVATION:
   - Each input cue has an "id" field
   - Each output translation MUST use the EXACT SAME "id"
   - ALL input IDs must appear in output (no missing IDs allowed)

3. ONE-TO-ONE MAPPING RULE:
   ✅ CORRECT: 1 input cue → 1 output translation
   ❌ WRONG: 2 input cues → 1 merged output (FORBIDDEN)
   ❌ WRONG: 1 input cue → 2 split outputs (FORBIDDEN)
   ❌ WRONG: Skip any input cue (FORBIDDEN)

4. EXAMPLE OF CORRECT BEHAVIOR:
   Input: {"cues": [{"id": 1, "text": "Hello"}], "expected_output_count": 1}
   Output: {"translations": [{"id": 1, "text_out": "Bonjour"}]}

TRANSLATION QUALITY GUIDELINES:
- Keep natural, conversational subtitles
- Keep all text on a SINGLE LINE (do not add \n line breaks)
- Preserve numbers, proper names, brand terms
- Keep tags like [music] untranslated

FINAL CHECK BEFORE RETURNING:
✓ Count the output translations - does it match "expected_output_count"?
✓ Check all input IDs - are they ALL present in the output?

Return format: {"translations": [{"id": <int>, "text_out": "<text>"}]}
`;
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function callOpenAI(config: TranslateConfig, systemPrompt: string, userContent: string, attempt: number = 0): Promise<any> {
  const base = config.baseUrl && config.baseUrl.trim() !== '' ? config.baseUrl : 'https://api.openai.com/v1';
  const url = base.replace(/\/+$/, '') + '/chat/completions';
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    if (attempt >= 3) {
      throw error;
    }
    const waitTime = 2000 * (2 ** attempt);
    await delay(waitTime);
    return callOpenAI(config, systemPrompt, userContent, attempt + 1);
  }
}

export async function translateCues(
  cues: Cue[],
  config: TranslateConfig,
  onProgress?: (msg: string) => void
): Promise<Cue[]> {
  const { sourceLang, targetLang, batchSize } = config;
  const systemPrompt = buildSystemPrompt(sourceLang, targetLang);
  
  const batches: Cue[][] = [];
  for (let i = 0; i < cues.length; i += batchSize) {
    batches.push(cues.slice(i, i + batchSize));
  }

  const allTranslated: Cue[] = [];
  let completed = 0;

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    
    if (onProgress) {
      onProgress(`Translating batch ${i + 1} of ${batches.length}...`);
    }

    const userContent = JSON.stringify({
      cues: batch.map(c => ({ id: c.id, text: c.text })),
      expected_output_count: batch.length
    });

    const result = await callOpenAI(config, systemPrompt, userContent);
    const translations: any[] = result.translations || [];
    
    const translationMap = new Map<number, string>();
    translations.forEach((t: any) => translationMap.set(t.id, t.text_out));

    for (const cue of batch) {
      let translatedText = translationMap.get(cue.id) || `[UNTRANSLATED] ${cue.text}`;
      translatedText = translatedText.replace(/\n/g, ' ').trim();
      
      const newCue: Cue = {
        ...cue,
        text: translatedText,
        warning: countReadingSpeed(translatedText, cue.start, cue.end)
      };
      allTranslated.push(newCue);
    }
    
    completed++;
  }

  return allTranslated;
}
