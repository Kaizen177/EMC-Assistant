// src/ai/flows/initial-prompt-augmentation.ts

/**
 * @fileOverview This file defines a function that loads a custom prompt from a file
 *               at build time, to be used by the AI.
 *
 * - initialPromptAugmentation - A function that returns the content of the prompt.txt file.
 */

import fs from 'fs';
import path from 'path';

const promptText = fs.readFileSync(path.join(process.cwd(), 'prompt.txt'), 'utf-8');

export function initialPromptAugmentation(): string {
  return promptText;
}
