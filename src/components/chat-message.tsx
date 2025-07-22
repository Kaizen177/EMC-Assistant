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
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLastMessage, isTyping }) => {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;

  const renderContent = (text: string) => {
    const parts = text.split(urlRegex);

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
      return part;
    });
  };

  if (message.role === 'assistant' && isLastMessage) {
    return <TypingAnimation text={message.content} />;
  }

  return <div>{renderContent(message.content)}</div>;
};

export default ChatMessage;
