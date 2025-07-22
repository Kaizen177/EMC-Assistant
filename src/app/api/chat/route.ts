// src/app/api/chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import fs from 'fs';
import path from 'path';

// Read the prompt file once when the server starts
const promptText = fs.readFileSync(path.join(process.cwd(), 'prompt.txt'), 'utf-8');

const AIPoweredChatInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional().describe('The chat history between the user and the chatbot.'),
});

const AIPoweredChatOutputSchema = z.object({
  response: z.string().describe('The response from the chatbot.'),
});

const InternalPromptSchema = AIPoweredChatInputSchema.extend({
    chatHistory: z.array(z.object({
        isUser: z.boolean(),
        content: z.string(),
    })).optional(),
    currentDate: z.string().optional(),
});

const chatPrompt = ai.definePrompt({
  name: 'aiPoweredChatPrompt',
  input: {
    schema: InternalPromptSchema,
  },
  output: {
    schema: AIPoweredChatOutputSchema,
  },
  prompt: `{{#if chatHistory}}
Chat History:
{{#each chatHistory}}
{{#if this.isUser}}User: {{this.content}}{{else}}Assistant: {{this.content}}{{/if}}
{{/each}}
{{/if}}
User: {{{message}}}`,
  system: `${promptText}`,
});

const aiPoweredChatFlow = ai.defineFlow(
  {
    name: 'aiPoweredChatFlow',
    inputSchema: AIPoweredChatInputSchema,
    outputSchema: AIPoweredChatOutputSchema,
  },
  async input => {
    
    const processedHistory = input.chatHistory?.map(item => ({
        isUser: item.role === 'user',
        content: item.content
    }));

    const currentDate = new Date().toLocaleString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const {
      output
    } = await chatPrompt({
        message: input.message,
        chatHistory: processedHistory,
        currentDate,
    });
    return {
      response: output!.response
    };
  }
);


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, chatHistory } = AIPoweredChatInputSchema.parse(body);

    const result = await aiPoweredChatFlow({ message, chatHistory });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in chat API route:', error);
    
    let errorMessage = 'An unknown error occurred.';
    if (error instanceof z.ZodError) {
        errorMessage = 'Invalid request body.';
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    if (error instanceof Error) {
        errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}