// src/components/chat-message.tsx

"use client";

import React from 'react';
import TypingAnimation from './typing-animation';

interface ChatMessageProps {
  message: {
    content: string;
    role: 'user' | 'assistant';
  };
  isLastMessage: boolean;
  isTyping: boolean;
  onAnimationUpdate: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLastMessage, isTyping, onAnimationUpdate }) => {
  const renderContent = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    const boldRegex = /\*\*(.*?)\*\*/g;

    const lines = text.split('\n');
    let inUlist = false;
    let inOlist = false;

    const processedLines = lines.map(line => {
      let processedLine = line;

      // Handle lists
      const uliMatch = /^\s*[-*]\s(.*)/.exec(processedLine);
      const oliMatch = /^\s*\d+\.\s(.*)/.exec(processedLine);

      if (uliMatch) {
        let prefix = '';
        if (!inUlist) {
          prefix = '<ul>';
          inUlist = true;
        }
        processedLine = `${prefix}<li>${uliMatch[1]}</li>`;
      } else if (inUlist) {
        processedLine = '</ul>' + processedLine;
        inUlist = false;
      }

      if (oliMatch) {
        let prefix = '';
        if (!inOlist) {
          prefix = '<ol>';
          inOlist = true;
        }
        processedLine = `${prefix}<li>${oliMatch[1]}</li>`;
      } else if (inOlist) {
        processedLine = '</ol>' + processedLine;
        inOlist = false;
      }

      // Handle bold
      processedLine = processedLine.replace(boldRegex, '<strong>$1</strong>');

      return processedLine;
    });

    if (inUlist) processedLines.push('</ul>');
    if (inOlist) processedLines.push('</ol>');
    
    const processedText = processedLines.join('\n').replace(/<\/ul>\n<ul>/g, '').replace(/<\/ol>\n<ol>/g, '');
    
    const parts = processedText.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        const href = part.startsWith('www.') ? `http://${part}` : part;
        return (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {part}
          </a>
        );
      }
      // Using dangerouslySetInnerHTML because we are constructing HTML for lists and bolding
      return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
    });
  };
  
  if (message.role === 'assistant' && isTyping && isLastMessage) {
    return <div />; // Render nothing for the placeholder assistant message while typing
  }
  
  if (message.role === 'assistant' && isLastMessage && !isTyping) {
    return <TypingAnimation text={message.content} onUpdate={onAnimationUpdate} />;
  }

  return <div>{renderContent(message.content)}</div>;
};

export default ChatMessage;
