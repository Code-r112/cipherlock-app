
'use server';
/**
 * @fileOverview An AI flow to analyze user activity for security recommendations.
 *
 * - analyzeSecurity - A function that takes activity logs and returns a security analysis.
 * - SecurityAnalysisInput - The input type for the analyzeSecurity function.
 * - SecurityAnalysisOutput - The return type for the analyzeSecurity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the schema for a single activity log entry
const ActivityLogSchema = z.object({
  action: z.enum(['encrypt', 'decrypt']),
  filename: z.string(),
  keyHash: z.string().describe("The SHA-256 hash of the key used for the operation."),
  timestamp: z.string().describe("The ISO 8601 timestamp of the activity."),
});

// Define the input schema for the security analysis flow
const SecurityAnalysisInputSchema = z.object({
  activityLogs: z.array(ActivityLogSchema),
});
export type SecurityAnalysisInput = z.infer<typeof SecurityAnalysisInputSchema>;

// Define the output schema for a single recommendation
const RecommendationSchema = z.object({
    title: z.string().describe("A short, clear title for the recommendation."),
    description: z.string().describe("A longer, more detailed explanation of the recommendation and why it's important."),
    severity: z.enum(['low', 'medium', 'high', 'info']).describe("The severity level of the issue."),
});

// Define the overall output schema for the security analysis
const SecurityAnalysisOutputSchema = z.object({
    overallScore: z.number().int().min(0).max(100).describe("A score from 0-100 representing the user's security posture. 100 is the best score."),
    recommendations: z.array(RecommendationSchema).describe("A list of security recommendations for the user."),
});
export type SecurityAnalysisOutput = z.infer<typeof SecurityAnalysisOutputSchema>;

// Define the main exported function that clients will call
export async function analyzeSecurity(input: SecurityAnalysisInput): Promise<SecurityAnalysisOutput> {
  return securityAuditFlow(input);
}

// Define the Genkit prompt
const prompt = ai.definePrompt({
  name: 'securityAuditPrompt',
  input: {schema: z.object({ activityLogsJson: z.string() }) },
  output: {schema: SecurityAnalysisOutputSchema},
  prompt: `You are a cybersecurity expert specializing in encryption best practices. Analyze the following user activity logs from the CipherLock application. The current date is ${new Date().toISOString()}.

Your task is to provide a security score and a list of actionable recommendations.

**Scoring Criteria:**
- Start with a score of 100.
- Deduct points for poor security practices.
- Key Reuse: Deduct 15 points for each instance of a key being reused across more than 3 files.
- Stale Activity: If the last activity was more than 30 days ago, deduct 10 points.
- No Decryption: If the user only ever encrypts and never decrypts, deduct 5 points as it might indicate they are not actively using the files.

**Recommendation Logic:**
- If you detect a key hash being used for more than 3 files, create a "high" severity recommendation to use different keys for different purposes.
- If you see long periods of inactivity (e.g., more than 30 days since the last action), create a "low" severity recommendation encouraging them to review their encrypted files.
- If you detect only encryption actions, add a "low" severity recommendation to test their decryption keys.
- If there are no issues, return an empty recommendations array and a score of 100.

**Input Data (JSON format):**
\`\`\`json
{{{activityLogsJson}}}
\`\`\`

Provide your analysis in the required JSON output format.
`,
});

// Define the Genkit flow
const securityAuditFlow = ai.defineFlow(
  {
    name: 'securityAuditFlow',
    inputSchema: SecurityAnalysisInputSchema,
    outputSchema: SecurityAnalysisOutputSchema,
  },
  async (input) => {
    // Genkit prompts work best with string inputs, so we serialize the input object.
    const {output} = await prompt({ activityLogsJson: JSON.stringify(input.activityLogs) });
    return output!;
  }
);
