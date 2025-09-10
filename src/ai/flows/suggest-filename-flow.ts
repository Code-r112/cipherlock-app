
'use server';
/**
 * @fileOverview An AI flow to suggest a descriptive filename.
 *
 * - suggestFilename - A function that suggests a filename based on file content.
 * - SuggestFilenameInput - The input type for the suggestFilename function.
 * - SuggestFilenameOutput - The return type for the suggestFilename function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFilenameInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "A file's content as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  originalName: z.string().describe('The original name of the file.'),
});
export type SuggestFilenameInput = z.infer<typeof SuggestFilenameInputSchema>;

const SuggestFilenameOutputSchema = z.object({
  suggestedName: z.string().describe('The suggested new filename.'),
});
export type SuggestFilenameOutput = z.infer<typeof SuggestFilenameOutputSchema>;

export async function suggestFilename(input: SuggestFilenameInput): Promise<SuggestFilenameOutput> {
  return suggestFilenameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFilenamePrompt',
  input: {schema: SuggestFilenameInputSchema},
  output: {schema: SuggestFilenameOutputSchema},
  prompt: `You are an expert at organizing files. Based on the content of the file and its original name, suggest a concise, descriptive, and secure filename.
The filename should be in a "kebab-case" format. For example, if the file is a receipt, suggest 'receipt-march-2024'. Do not include the path or original extension, only the filename base.

Original filename: {{{originalName}}}
File content: {{media url=fileDataUri}}`,
});

const suggestFilenameFlow = ai.defineFlow(
  {
    name: 'suggestFilenameFlow',
    inputSchema: SuggestFilenameInputSchema,
    outputSchema: SuggestFilenameOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
