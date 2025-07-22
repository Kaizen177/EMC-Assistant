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
  onAnimationComplete: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLastMessage, isTyping, onAnimationUpdate, onAnimationComplete }) => {
  const renderContent = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    const boldRegex = /\*\*(.*?)\*\*/g;

    const processLine = (line: string, keyPrefix: string) => {
      const parts = line.split(urlRegex).filter(Boolean);
      return parts.map((part, index) => {
        if (part.match(urlRegex)) {
          const href = part.startsWith('www.') ? `http://${part}` : part;
          return (
            <a
              key={`${keyPrefix}-link-${index}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 bg-green-100 border border-green-300 px-1.5 py-0.5 rounded-md transition-colors duration-200 hover:bg-green-700 hover:text-white"
            >
              {part}
            </a>
          );
        }
        const boldParts = part.split(boldRegex).filter(Boolean);
        return boldParts.map((boldPart, boldIndex) => {
          if (boldIndex % 2 === 1 && part.includes(`**${boldPart}**`)) {
            return <strong key={`${keyPrefix}-bold-${index}-${boldIndex}`}>{boldPart}</strong>;
          }
          return <span key={`${keyPrefix}-text-${index}-${boldIndex}`} dangerouslySetInnerHTML={{ __html: boldPart }} />;
        });
      }).flat();
    };
    
    const lines = text.split('\n');
    const elements: (JSX.Element | string)[] = [];
    let list: { type: 'ul' | 'ol'; items: string[] } | null = null;

    const flushList = () => {
      if (list) {
        const ListTag = list.type;
        elements.push(
          <ListTag key={`list-${elements.length}`} className={(ListTag === 'ul' ? 'list-disc' : 'list-decimal') + ' pl-5 space-y-1 my-4 first:mt-0 last:mb-0'}>
            {list.items.map((item, index) => (
              <li key={index}>{processLine(item, `li-${index}`)}</li>
            ))}
          </ListTag>
        );
        list = null;
      }
    };

    lines.forEach((line) => {
      const uliMatch = /^\s*[-*]\s(.*)/.exec(line);
      const oliMatch = /^\s*\d+\.\s(.*)/.exec(line);

      if (uliMatch) {
        if (list?.type !== 'ul') flushList();
        if (!list) list = { type: 'ul', items: [] };
        list.items.push(uliMatch[1]);
      } else if (oliMatch) {
        if (list?.type !== 'ol') flushList();
        if (!list) list = { type: 'ol', items: [] };
        list.items.push(oliMatch[1]);
      } else {
        flushList();
        if (line.trim() !== '') {
            elements.push(line);
        }
      }
    });

    flushList();

    return elements.map((el, i) => {
        if(typeof el === 'string') {
            return <p key={`p-${i}`} className="my-4 first:mt-0 last:mb-0">{processLine(el, `p-line-${i}`)}</p>
        }
        return el;
    });
  };

  if (message.role === 'assistant' && isTyping && isLastMessage) {
    return <div />;
  }

  if (message.role === 'assistant' && isLastMessage && !isTyping) {
    return <TypingAnimation text={message.content} onUpdate={onAnimationUpdate} onComplete={onAnimationComplete} />;
  }

  return <div className="space-y-2">{renderContent(message.content)}</div>;
};

export default ChatMessage;
