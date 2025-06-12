'use server';

/**
 * @fileOverview Provides usage tips for the URL shortener.
 *
 * - getUsageTips - A function that returns usage tips for the URL shortener.
 * - UsageTipsInput - The input type for the getUsageTips function.
 * - UsageTipsOutput - The return type for the getUsageTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UsageTipsInputSchema = z.object({
  context: z
    .string()
    .optional()
    .describe('Optional context about what the user is trying to do.'),
});
export type UsageTipsInput = z.infer<typeof UsageTipsInputSchema>;

const UsageTipsOutputSchema = z.object({
  tips: z.string().describe('Helpful tips and suggestions for using the URL shortener.'),
});
export type UsageTipsOutput = z.infer<typeof UsageTipsOutputSchema>;

export async function getUsageTips(input: UsageTipsInput): Promise<UsageTipsOutput> {
  return usageTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'usageTipsPrompt',
  input: {schema: UsageTipsInputSchema},
  output: {schema: UsageTipsOutputSchema},
  prompt: `You are an AI assistant designed to provide helpful tips and suggestions for using a URL shortener.

  Provide clear and concise tips to help users understand the features and maximize the utility of the URL shortener.

  Context: {{{context}}}

  Tips:`,
});

const usageTipsFlow = ai.defineFlow(
  {
    name: 'usageTipsFlow',
    inputSchema: UsageTipsInputSchema,
    outputSchema: UsageTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
