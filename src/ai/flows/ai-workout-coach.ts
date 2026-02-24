'use server';
/**
 * @fileOverview An AI workout coach that provides motivational messages, encouragement, or technique tips.
 *
 * - aiWorkoutCoach - A function that handles generating workout coaching messages.
 * - AiWorkoutCoachInput - The input type for the aiWorkoutCoach function.
 * - AiWorkoutCoachOutput - The return type for the aiWorkoutCoach function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Defines the input schema for the AI workout coach flow.
 */
const AiWorkoutCoachInputSchema = z.object({
  currentExercise: z
    .string()
    .optional()
    .describe('The name of the current exercise being performed.'),
  workoutPhase: z
    .string()
    .describe(
      'The current phase of the workout (e.g., "warmup", "work", "rest", "cooldown", "workout-complete").'
    ),
});
export type AiWorkoutCoachInput = z.infer<typeof AiWorkoutCoachInputSchema>;

/**
 * Defines the output schema for the AI workout coach flow.
 */
const AiWorkoutCoachOutputSchema = z.object({
  message: z
    .string()
    .describe(
      'A motivational message, encouraging phrase, or brief technique tip.'
    ),
});
export type AiWorkoutCoachOutput = z.infer<typeof AiWorkoutCoachOutputSchema>;

/**
 * Generates a motivational message, encouraging phrase, or technique tip based on the current workout context.
 * @param input - The input containing the current exercise and workout phase.
 * @returns A promise that resolves to an object containing the generated message.
 */
export async function aiWorkoutCoach(
  input: AiWorkoutCoachInput
): Promise<AiWorkoutCoachOutput> {
  return aiWorkoutCoachFlow(input);
}

/**
 * Defines the prompt for the AI workout coach.
 * This prompt instructs the AI to act as an encouraging workout coach and generate contextually relevant messages.
 */
const coachPrompt = ai.definePrompt({
  name: 'aiWorkoutCoachPrompt',
  input: {schema: AiWorkoutCoachInputSchema},
  output: {schema: AiWorkoutCoachOutputSchema},
  prompt: `You are an encouraging and knowledgeable workout coach for the "Suit & Sweat" app. Your goal is to keep the user motivated, provide helpful tips, and maintain a positive atmosphere.

Based on the user's current workout phase and, if applicable, the specific exercise they are doing, provide a concise and inspiring message. This message can be a motivational quote, an encouraging phrase, or a brief, actionable technique tip.

Current Workout Phase: {{{workoutPhase}}}
{{#if currentExercise}}
Current Exercise: {{{currentExercise}}}
{{/if}}

Guidance:
- If 'currentExercise' is provided, prioritize a technique tip or specific encouragement related to that exercise.
- If 'currentExercise' is not provided, provide general motivation or encouragement relevant to the 'workoutPhase'.
- Keep messages short, impactful, and encouraging.
- Avoid overly complex language.
- For "workout-complete" phase, provide a congratulatory message and encourage recovery.
`,
});

/**
 * Defines the Genkit flow for the AI workout coach.
 * This flow takes workout context as input, calls the coach prompt, and returns the generated message.
 */
const aiWorkoutCoachFlow = ai.defineFlow(
  {
    name: 'aiWorkoutCoachFlow',
    inputSchema: AiWorkoutCoachInputSchema,
    outputSchema: AiWorkoutCoachOutputSchema,
  },
  async input => {
    const {output} = await coachPrompt(input);
    return output!;
  }
);
