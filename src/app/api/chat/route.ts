
// src/app/api/chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import fs from 'fs';
import path from 'path';

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
        role: z.enum(['user', 'model']),
        content: z.any(),
    })).optional(),
    currentDate: z.string(),
});


const aiPoweredChatFlow = ai.defineFlow(
  {
    name: 'aiPoweredChatFlow',
    inputSchema: z.object({
      message: z.string(),
      chatHistory: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string()
      })).optional(),
      promptText: z.string(),
    }),
    outputSchema: AIPoweredChatOutputSchema,
  },
  async (input) => {

    const currentDate = new Date().toLocaleString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const systemPrompt = input.promptText.replace('{{currentDate}}', currentDate);

    const history = (input.chatHistory || []).map(message => ({
        role: message.role === 'user' ? 'user' : 'model',
        content: [{ text: message.content }]
    }));

    const response = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        system: systemPrompt,
        messages: [...history, { role: 'user', content: [{ text: input.message }] }],
    });
    
    const text = response.text;
    if (!text) {
      throw new Error('AI failed to generate a response.');
    }

    return {
      response: text
    };
  }
);

// The main POST request handler.
export async function POST(req: NextRequest) {
  try {
    // Read the prompt file on every request to get the latest version.
    const promptText = fs.readFileSync(path.join(process.cwd(), 'prompt.txt'), 'utf-8');

    const body = await req.json();
    
    // Handle warmup request
    if (body.warmup) {
      return NextResponse.json({ status: 'warmed up' });
    }
    
    // Validate the incoming request body for actual chat messages.
    const { message, chatHistory } = AIPoweredChatInputSchema.parse(body);

    // Execute the pre-defined Genkit flow.
    const result = await aiPoweredChatFlow({ message, chatHistory, promptText });

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
