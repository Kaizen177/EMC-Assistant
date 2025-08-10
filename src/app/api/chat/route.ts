
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
        isUser: z.boolean(),
        content: z.string(),
    })).optional(),
    currentDate: z.string(),
});

// Function to calculate and interpret DASS-21 scores
const calculateDass21 = (answers: number[]): string => {
    const depressionIndices = [3, 5, 10, 13, 16, 17, 21];
    const anxietyIndices = [2, 4, 7, 9, 15, 19, 20];
    const stressIndices = [1, 6, 8, 11, 12, 14, 18];

    const calculateScore = (indices: number[]) => indices.reduce((sum, index) => sum + (answers[index - 1] || 0), 0) * 2;

    const depressionScore = calculateScore(depressionIndices);
    const anxietyScore = calculateScore(anxietyIndices);
    const stressScore = calculateScore(stressIndices);

    const getDepressionLevel = (score: number) => {
        if (score >= 28) return "Extrêmement sévère";
        if (score >= 21) return "Sévère";
        if (score >= 14) return "Modéré";
        if (score >= 10) return "Léger";
        return "Normal";
    };

    const getAnxietyLevel = (score: number) => {
        if (score >= 20) return "Extrêmement sévère";
        if (score >= 15) return "Sévère";
        if (score >= 10) return "Modéré";
        if (score >= 8) return "Léger";
        return "Normal";
    };

    const getStressLevel = (score: number) => {
        if (score >= 34) return "Extrêmement sévère";
        if (score >= 26) return "Sévère";
        if (score >= 19) return "Modéré";
        if (score >= 15) return "Léger";
        return "Normal";
    };

    const depressionLevel = getDepressionLevel(depressionScore);
    const anxietyLevel = getAnxietyLevel(anxietyScore);
    const stressLevel = getStressLevel(stressScore);
    
    const hasIssues = [depressionLevel, anxietyLevel, stressLevel].some(level => !['Normal', 'Léger'].includes(level));

    let response = `Voici les résultats de votre évaluation :\n\n- Dépression : Score de ${depressionScore}, niveau ${depressionLevel}.\n- Anxiété : Score de ${anxietyScore}, niveau ${anxietyLevel}.\n- Stress : Score de ${stressScore}, niveau ${stressLevel}.`;
    
    response += "\n\nCe test est une évaluation et non un diagnostic. Pour un avis adapté, consultez un professionnel.";

    if (hasIssues) {
      response += " Vous pouvez trouver des ressources ici : www.ressources1223.ma";
    }

    return response;
};

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
    
    // Check if the message is a DASS-21 submission
    const dass21Prefixes = [
        "Mes réponses sont :",
        "My answers are:",
        "إجاباتاتي هي:",
    ];

    const prefix = dass21Prefixes.find(p => message.includes(p));

    if (prefix) {
        const answersString = message.substring(message.indexOf(prefix) + prefix.length);
        const answers = answersString.split(',').map(s => parseInt(s.trim(), 10));
        
        if (answers.length === 21 && answers.every(n => !isNaN(n))) {
            const result = calculateDass21(answers);
            return NextResponse.json({ response: result });
        }
    }


    // Read the prompt file on every request to ensure the latest version is used.
    const promptText = fs.readFileSync(path.join(process.cwd(), 'prompt.txt'), 'utf-8');

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

    // Execute the Genkit flow.
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
