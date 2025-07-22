# **App Name**: EMC Assistant (Beta)

## Core Features:

- Chat Bubble UI: Implements a chat bubble UI in the bottom right corner that expands on click, offering a smooth animation.
- Responsive Design: The chatbot interface adjusts to fit different screen sizes and should take full screen in phone mode.
- AI-Powered Chat: The chatbot uses the Google Gemini API as its LLM in the backend to generate the responeses, utilizing a 12-message memory.
- Custom Prompt Loading: Loads a prompt from a prompt.txt file that helps the Google Gemini model behave the correct way. This prompt acts as a tool to improve reasoning.
- Embeddable Component: Designed to be embedded into a WordPress website using an <iframe> tag.
- Vercel Ready: Configuration is designed so that the project is ready to be deployed on Vercel.

## Style Guidelines:

- Primary color: A vibrant blue (#29ABE2) to reflect trust and communication, avoiding a generic corporate look.
- Background color: White (#FFFFFF) to create a clean and inviting chat interface.
- Accent color: A light blue (#ADD8E6) used sparingly for highlights and interactive elements.
- Font: 'Inter', a sans-serif font, is used for both headings and body text due to its clean, readable design suitable for all screen sizes. Note: currently only Google Fonts are supported.
- Simple, outlined icons are used for UI elements to ensure clarity and a modern aesthetic.
- A clean, card-based layout with a focus on readability and ease of use.
- Smooth, subtle transitions and animations are used to enhance user experience.