'use server';
/**
 * @fileOverview An AI flow for generating user profile avatars.
 *
 * - generateAvatar - A function that handles the avatar generation process.
 * - GenerateAvatarInput - The input type for the generateAvatar function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateAvatarInputSchema = z.object({
    hint: z.string().describe('A text description of the desired avatar image.'),
});
export type GenerateAvatarInput = z.infer<typeof GenerateAvatarInputSchema>;


const generateAvatarFlow = ai.defineFlow(
  {
    name: 'generateAvatarFlow',
    inputSchema: GenerateAvatarInputSchema,
    outputSchema: z.string(),
  },
  async ({ hint }) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate a modern, minimalist, circular profile avatar. The avatar should be a creative interpretation of the following idea: "${hint}"`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    
    if (!media?.url) {
        throw new Error('Image generation failed to produce an output.');
    }

    return media.url;
  }
);

export async function generateAvatar(input: GenerateAvatarInput): Promise<string> {
    return generateAvatarFlow(input);
}
