'use server';
/**
 * @fileOverview An AI-powered task generator for project management.
 *
 * - generateTasks - A function that breaks down a high-level goal into a list of tasks.
 * - GenerateTasksInput - The input type for the generateTasks function.
 * - GenerateTasksOutput - The return type for the generateTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTasksInputSchema = z.object({
  goal: z
    .string()
    .describe(
      'A high-level project goal or feature description.'
    ),
});
export type GenerateTasksInput = z.infer<typeof GenerateTasksInputSchema>;

const TaskSchema = z.object({
    title: z.string().describe('A short, actionable title for the task.'),
    description: z.string().describe('A brief description of what needs to be done for this task.'),
    priority: z.enum(['Low', 'Medium', 'High']).describe('The priority of the task.'),
});

const GenerateTasksOutputSchema = z.object({
  tasks: z.array(TaskSchema).describe('An array of generated tasks.'),
});
export type GenerateTasksOutput = z.infer<typeof GenerateTasksOutputSchema>;

export async function generateTasks(input: GenerateTasksInput): Promise<GenerateTasksOutput> {
  return generateTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTasksPrompt',
  input: {schema: GenerateTasksInputSchema},
  output: {schema: GenerateTasksOutputSchema},
  prompt: `You are an expert project manager. Your job is to break down a high-level goal into smaller, actionable tasks for a Kanban board.

For the given goal, generate a list of tasks. Each task must have a title, a short description, and a priority (Low, Medium, or High).

Goal: {{{goal}}}

Return the list of tasks in the specified JSON format.
`,
});

const generateTasksFlow = ai.defineFlow(
  {
    name: 'generateTasksFlow',
    inputSchema: GenerateTasksInputSchema,
    outputSchema: GenerateTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
