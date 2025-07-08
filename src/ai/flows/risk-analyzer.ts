'use server';

/**
 * @fileOverview An AI-powered risk analyzer for project management.
 *
 * - analyzeProjectRisks - A function that analyzes project communications and flags potential risks.
 * - AnalyzeProjectRisksInput - The input type for the analyzeProjectRisks function.
 * - AnalyzeProjectRisksOutput - The return type for the analyzeProjectRisks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeProjectRisksInputSchema = z.object({
  projectCommunications: z
    .string()
    .describe(
      'A string containing all project related communications, such as emails, chat logs, and meeting notes.'
    ),
});
export type AnalyzeProjectRisksInput = z.infer<typeof AnalyzeProjectRisksInputSchema>;

const AnalyzeProjectRisksOutputSchema = z.object({
  riskAssessment: z.array(
    z.object({
      risk: z.string().describe('The identified risk.'),
      severity: z.enum(['HIGH', 'MEDIUM', 'LOW']).describe('The severity of the risk.'),
      likelihood: z.enum(['HIGH', 'MEDIUM', 'LOW']).describe('The likelihood of the risk occurring.'),
      impact: z.string().describe('The potential impact of the risk on the project.'),
      mitigationStrategy: z.string().describe('A suggested mitigation strategy for the risk.'),
    })
  ).describe('An array of risk assessments.'),
  overallProjectRisk: z.enum(['HIGH', 'MEDIUM', 'LOW']).describe('The overall risk level for the project.'),
});
export type AnalyzeProjectRisksOutput = z.infer<typeof AnalyzeProjectRisksOutputSchema>;

export async function analyzeProjectRisks(input: AnalyzeProjectRisksInput): Promise<AnalyzeProjectRisksOutput> {
  return analyzeProjectRisksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeProjectRisksPrompt',
  input: {schema: AnalyzeProjectRisksInputSchema},
  output: {schema: AnalyzeProjectRisksOutputSchema},
  prompt: `You are an AI project risk analyst. Analyze the following project communications to identify potential risks, assess their severity, likelihood and impact, and suggest mitigation strategies. Return the analysis in JSON format.

Project Communications: {{{projectCommunications}}}

Consider potential risks related to scope, timeline, resources, budget, communication, and external factors. Also, based on individual risk assessments, determine and classify the overall project risk level (HIGH, MEDIUM, or LOW).
`,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  }
});

const analyzeProjectRisksFlow = ai.defineFlow(
  {
    name: 'analyzeProjectRisksFlow',
    inputSchema: AnalyzeProjectRisksInputSchema,
    outputSchema: AnalyzeProjectRisksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
