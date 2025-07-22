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
    let htmlContent = '';
    let inUList = false;
    let inOList = false;
  
    lines.forEach((line, index) => {
      let processedLine = line;
  
      // Handle lists
      const uliMatch = /^\s*[-*]\s(.*)/.exec(processedLine);
      const oliMatch = /^\s*\d+\.\s(.*)/.exec(processedLine);
  
      if (uliMatch) {
        if (inOList) {
          htmlContent += '</ol>';
          inOList = false;
        }
        if (!inUList) {
          htmlContent += '<ul>';
          inUList = true;
        }
        htmlContent += `<li>${uliMatch[1]}</li>`;
      } else if (oliMatch) {
        if (inUList) {
          htmlContent += '</ul>';
          inUList = false;
        }
        if (!inOList) {
          htmlContent += '<ol>';
          inOList = true;
        }
        htmlContent += `<li>${oliMatch[1]}</li>`;
      } else {
        if (inUList) {
          htmlContent += '</ul>';
          inUList = false;
        }
        if (inOList) {
          htmlContent += '</ol>';
          inOList = false;
        }
        htmlContent += `<p>${processedLine}</p>`;
      }
    });
  
    if (inUList) htmlContent += '</ul>';
    if (inOList) htmlContent += '</ol>';
  
    // Handle bold
    htmlContent = htmlContent.replace(boldRegex, '<strong>$1</strong>');
  
    const parts = htmlContent.split(urlRegex);
  
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
