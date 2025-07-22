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

    const processPart = (part: string, key: number) => {
      if (part.match(urlRegex)) {
        const href = part.startsWith('www.') ? `http://${part}` : part;
        return (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-foreground bg-accent px-1.5 py-0.5 rounded-md hover:underline"
          >
            {part}
          </a>
        );
      }
      
      const boldParts = part.split(boldRegex);
      return boldParts.map((boldPart, boldIndex) => {
        if (boldIndex % 2 === 1) {
          return <strong key={`${key}-${boldIndex}`}>{boldPart}</strong>;
        }
        return <span key={`${key}-${boldIndex}`} dangerouslySetInnerHTML={{ __html: boldPart }} />;
      });
    };

    const processLine = (line: string, keyPrefix: string) => {
      const parts = line.split(urlRegex);
      return parts.map((part, index) => processPart(part, index)).flat();
    };

    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let list: { type: 'ul' | 'ol'; items: string[] } | null = null;

    const flushList = () => {
      if (list) {
        const ListTag = list.type;
        elements.push(
          <ListTag key={`list-${elements.length}`} className={ListTag === 'ul' ? 'list-disc' : 'list-decimal' + ' pl-5 space-y-1 my-2'}>
            {list.items.map((item, index) => (
              <li key={index}>{processLine(item, `li-${index}`)}</li>
            ))}
          </ListTag>
        );
        list = null;
      }
    };

    lines.forEach((line, lineIndex) => {
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
           elements.push(<p key={`p-${lineIndex}`}>{processLine(line, `p-line-${lineIndex}`)}</p>);
        }
      }
    });

    flushList();

    return elements;
  };

  if (message.role === 'assistant' && isTyping && isLastMessage) {
    return <div />;
  }

  if (message.role === 'assistant' && isLastMessage && !isTyping) {
    return <TypingAnimation text={message.content} onUpdate={onAnimationUpdate} />;
  }

  return <div>{renderContent(message.content)}</div>;
};

export default ChatMessage;
