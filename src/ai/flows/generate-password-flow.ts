'use server';
/**
 * @fileOverview A flow for generating secure passwords.
 *
 * - generatePassword - A function that generates a secure password.
 * - GeneratePasswordInput - The input type for the generatePassword function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GeneratePasswordInputSchema = z.object({
  length: z.number().min(8).max(128).default(16),
  includeUppercase: z.boolean().default(true),
  includeNumbers: z.boolean().default(true),
  includeSymbols: z.boolean().default(true),
});
export type GeneratePasswordInput = z.infer<typeof GeneratePasswordInputSchema>;

export async function generatePassword(input: GeneratePasswordInput): Promise<string> {
    const result = await generatePasswordFlow(input);
    return result.password;
}

const prompt = ai.definePrompt({
  name: 'generatePasswordPrompt',
  input: {schema: GeneratePasswordInputSchema},
  output: {schema: z.object({password: z.string().describe('The generated password.')})},
  prompt: `Generate a secure, random password with the following requirements:
- Length: {{{length}}}
- Include Uppercase Letters: {{{includeUppercase}}}
- Include Numbers: {{{includeNumbers}}}
- Include Symbols: {{{includeSymbols}}}

Only output the password and nothing else.`,
});

const generatePasswordFlow = ai.defineFlow(
  {
    name: 'generatePasswordFlow',
    inputSchema: GeneratePasswordInputSchema,
    outputSchema: z.object({password: z.string()}),
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
