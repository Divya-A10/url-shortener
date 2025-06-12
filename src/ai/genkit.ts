import {genkit} from 'genkit';
// import {googleAI} from '@genkit-ai/googleai'; // Removed as Gemini API will not be used

export const ai = genkit({
  plugins: [], // googleAI() plugin removed
  // model: 'googleai/gemini-2.0-flash', // Removed as it depends on the googleAI plugin
});
