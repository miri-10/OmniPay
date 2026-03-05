import { createGroq } from '@ai-sdk/groq';

export const groqProvider = createGroq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

export const DEFAULT_MODEL = 'llama-3.3-70b-versatile';
