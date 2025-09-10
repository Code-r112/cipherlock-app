
'use server';
/**
 * @fileOverview An AI flow to suggest a saved encryption key based on file content.
 *
 * - suggestKey - A function that suggests a key.
 * - SuggestKeyInput - The input type for the suggestKey function.
 * - SuggestKeyOutput - The return type for the suggestKey function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SavedKeySchema = z.object({
    id: z.string(),
    name: z.string(),
    key: z.string(),
});

const SuggestKeyInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "A file's content as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  savedKeys: z.array(SavedKeySchema).describe("The user's list of saved keys, each with a name and value."),
});
export type SuggestKeyInput = z.infer<typeof SuggestKeyInputSchema>;

const SuggestKeyOutputSchema = z.object({
  suggestedKeyId: z.string().describe("The ID of the suggested key from the user's saved keys. Returns an empty string if no suitable key is found."),
});
export type SuggestKeyOutput = z.infer<typeof SuggestKeyOutputSchema>;

export async function suggestKey(input: SuggestKeyInput): Promise<SuggestKeyOutput> {
  return suggestKeyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestKeyPrompt',
  input: {schema: z.object({
    fileDataUri: SuggestKeyInputSchema.shape.fileDataUri,
    savedKeysJson: z.string(),
  })},
  output: {schema: SuggestKeyOutputSchema},
  prompt: `You are an expert at security and organization. Your task is to recommend one of the user's saved encryption keys for the given file.

Analyze the file's content and the names of the user's saved keys. Choose the key that is most contextually appropriate for the file. For example, a file containing financial data should use a key named 'Financial Docs Key'.

If no key seems appropriate, return an empty string for the 'suggestedKeyId'.

User's Saved Keys (JSON):
{{{savedKeysJson}}}

File content to analyze:
{{media url=fileDataUri}}
`,
});

const suggestKeyFlow = ai.defineFlow(
  {
    name: 'suggestKeyFlow',
    inputSchema: SuggestKeyInputSchema,
    outputSchema: SuggestKeyOutputSchema,
  },
  async input => {
    // If the user has no saved keys, don't bother calling the AI.
    if (input.savedKeys.length === 0) {
        return { suggestedKeyId: '' };
    }
    const {output} = await prompt({
      fileDataUri: input.fileDataUri,
      savedKeysJson: JSON.stringify(input.savedKeys),
    });
    return output!;
  }
);
