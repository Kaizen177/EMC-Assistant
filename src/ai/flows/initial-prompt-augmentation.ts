// src/ai/flows/initial-prompt-augmentation.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow that loads a custom prompt from a file
 *               and uses it to augment the initial prompt for the AI, guiding its behavior.
 *
 * - initialPromptAugmentation - A function that returns the content of the prompt.txt file.
 * - InitialPromptAugmentationOutput - The return type for the initialPromptAugmentation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import * as fs from 'fs';
import path from 'path';

const InitialPromptAugmentationOutputSchema = z.string();
export type InitialPromptAugmentationOutput = z.infer<typeof InitialPromptAugmentationOutputSchema>;

async function readPromptFromFile(): Promise<string> {
  const filePath = path.join(process.cwd(), 'prompt.txt');
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return fileContent;
  } catch (error) {
    console.error('Error reading prompt file:', error);
    return '';
  }
}

export async function initialPromptAugmentation(): Promise<InitialPromptAugmentationOutput> {
  return initialPromptAugmentationFlow();
}

const initialPromptAugmentationFlow = ai.defineFlow({
    name: 'initialPromptAugmentationFlow',
    inputSchema: z.void(),
    outputSchema: InitialPromptAugmentationOutputSchema,
  },
  async () => {
    return await readPromptFromFile();
  }
);
