'use server';

/**
 * @fileOverview AI-Powered Chat flow using Google Gemini API.
 *
 * - aiPoweredChat - A function that handles the chat interaction.
 * - AIPoweredChatInput - The input type for the aiPoweredChat function.
 * - AIPoweredChatOutput - The return type for the aiPoweredChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import * as fs from 'fs';

const AIPoweredChatInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional().describe('The chat history between the user and the chatbot.'),
});

export type AIPoweredChatInput = z.infer<typeof AIPoweredChatInputSchema>;

const AIPoweredChatOutputSchema = z.object({
  response: z.string().describe('The response from the chatbot.'),
});

export type AIPoweredChatOutput = z.infer<typeof AIPoweredChatOutputSchema>;

export async function aiPoweredChat(input: AIPoweredChatInput): Promise<AIPoweredChatOutput> {
  return aiPoweredChatFlow(input);
}

const promptText = fs.readFileSync('./prompt.txt', 'utf-8');

const chatPrompt = ai.definePrompt({
  name: 'aiPoweredChatPrompt',
  input: {
    schema: AIPoweredChatInputSchema,
  },
  output: {
    schema: AIPoweredChatOutputSchema,
  },
  prompt: `{{#if chatHistory}}
Chat History:
{{#each chatHistory}}
{{#if (eq this.role "user")}}User: {{this.content}}{{else}}Assistant: {{this.content}}{{/if}}
{{/each}}
{{/if}}
User: {{{message}}}`,
  system: promptText,
});

const aiPoweredChatFlow = ai.defineFlow(
  {
    name: 'aiPoweredChatFlow',
    inputSchema: AIPoweredChatInputSchema,
    outputSchema: AIPoweredChatOutputSchema,
  },
  async input => {
    const {
      output
    } = await chatPrompt(input);
    return {
      response: output!.response
    };
  }
);