
// src/app/api/chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import fs from 'fs';
import path from 'path';

// Read the prompt file once when the serverless function initializes.
// This is the stable and performant way to handle external files in a serverless environment.
const promptText = fs.readFileSync(path.join(process.cwd(), 'prompt.txt'), 'utf-8');

const AIPoweredChatInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional().describe('The chat history between the user and the chatbot.'),
  warmup: z.boolean().optional(),
});

const AIPoweredChatOutputSchema = z.object({
  response: z.string().describe('The response from the chatbot.'),
});

// Define the schema for the prompt's input, including the processed history and current date.
const InternalPromptSchema = z.object({
    message: z.string(),
    chatHistory: z.array(z.object({
        isUser: z.boolean(),
        content: z.string(),
    })).optional(),
    currentDate: z.string(),
});

// Define the Genkit prompt and flow *outside* the request handler.
// This ensures they are created only once when the function initializes.
const chatPrompt = ai.definePrompt({
  name: 'aiPoweredChatPrompt',
  input: {
    schema: InternalPromptSchema,
  },
  output: {
    schema: AIPoweredChatOutputSchema,
  },
  system: promptText,
  prompt: `{{#if chatHistory}}
Chat History:
{{#each chatHistory}}
{{#if this.isUser}}User: {{this.content}}{{else}}Assistant: {{this.content}}{{/if}}
{{/each}}
{{/if}}

User: {{{message}}}`,
});

const aiPoweredChatFlow = ai.defineFlow(
  {
    name: 'aiPoweredChatFlow',
    inputSchema: AIPoweredChatInputSchema,
    outputSchema: AIPoweredChatOutputSchema,
  },
  async (input) => {
    // Process chat history to match the prompt's expected format.
    const processedHistory = input.chatHistory?.map(item => ({
        isUser: item.role === 'user',
        content: item.content
    }));

    // Get the current date and time.
    const currentDate = new Date().toLocaleString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // Call the pre-defined prompt with the processed input.
    const { output } = await chatPrompt({
        message: input.message,
        chatHistory: processedHistory,
        currentDate,
    });
    
    if (!output) {
      throw new Error('AI failed to generate a response.');
    }

    return {
      response: output.response
    };
  }
);

// The main POST request handler.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Handle warmup request
    if (body.warmup) {
      return NextResponse.json({ status: 'warmed up' });
    }
    
    // Validate the incoming request body for actual chat messages.
    const { message, chatHistory } = AIPoweredChatInputSchema.parse(body);

    // Execute the pre-defined Genkit flow.
    const result = await aiPoweredChatFlow({ message, chatHistory });

    return NextResponse.json(result);
  } catch (error) {
    // Log the detailed error on the server for debugging.
    console.error('Error in chat API route:', error);
    
    let errorMessage = 'An unknown error occurred.';
    let statusCode = 500;

    if (error instanceof z.ZodError) {
        errorMessage = 'Invalid request body.';
        statusCode = 400;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }

    // Return a JSON error response to the client.
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
