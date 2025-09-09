'use server';
/**
 * @fileOverview A flow for analyzing password strength.
 *
 * - analyzePassword - A function that analyzes the strength of a password.
 * - AnalyzePasswordOutput - The return type for the analyzePassword function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePasswordOutputSchema = z.object({
  strength: z.enum(['weak', 'medium', 'strong', 'very-strong']).describe('The strength of the password.'),
  suggestions: z.array(z.string()).describe('Suggestions for improving the password.'),
});
export type AnalyzePasswordOutput = z.infer<typeof AnalyzePasswordOutputSchema>;

export async function analyzePassword(password: string): Promise<AnalyzePasswordOutput> {
  return await analyzePasswordFlow(password);
}

const prompt = ai.definePrompt({
  name: 'analyzePasswordPrompt',
  input: {schema: z.string()},
  output: {schema: AnalyzePasswordOutputSchema},
  prompt: `Analyze the strength of the following password: {{{input}}}. 
  
  Rate its strength as one of: weak, medium, strong, or very-strong.
  Provide concrete suggestions for how to make it stronger. If it's already very strong, the suggestions can be empty.
  `,
});

const analyzePasswordFlow = ai.defineFlow(
  {
    name: 'analyzePasswordFlow',
    inputSchema: z.string(),
    outputSchema: AnalyzePasswordOutputSchema,
  },
  async (password) => {
    if (!password) {
        return {
            strength: 'weak',
            suggestions: ['Password cannot be empty.'],
        }
    }
    const {output} = await prompt(password);
    return output!;
  }
);
