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

    const renderLine = (line: string, lineKey: string, isListItem: boolean) => {
      const parts = line.split(boldRegex).filter(Boolean);
      const content = parts.map((part, index) => {
        if (index % 2 === 1) {
          return <strong key={`${lineKey}-bold-${index}`}>{part}</strong>;
        }

        const linkParts = part.split(urlRegex).filter(Boolean);
        return linkParts.map((linkPart, linkIndex) => {
          if (linkPart.match(urlRegex)) {
            const href = linkPart.startsWith('www.') ? `http://${linkPart}` : linkPart;
            return (
              <a
                key={`${lineKey}-link-${index}-${linkIndex}`}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 bg-green-100 border border-green-300 px-1.5 py-0.5 rounded-md transition-all duration-200 hover:font-bold"
              >
                {linkPart}
              </a>
            );
          }
          return <span key={`${lineKey}-text-${index}-${linkIndex}`} dangerouslySetInnerHTML={{ __html: linkPart }} />;
        });
      });
      return isListItem ? <>{content}</> : <p className="my-4 first:mt-0 last:mb-0">{content}</p>;
    };

    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let list: { type: 'ul' | 'ol'; items: string[] } | null = null;

    const flushList = (key: string) => {
      if (list) {
        const ListTag = list.type;
        elements.push(
          <ListTag key={key} className={(ListTag === 'ul' ? 'list-disc' : 'list-decimal') + ' pl-5 space-y-1 my-4 first:mt-0 last:mb-0'}>
            {list.items.map((item, index) => (
              <li key={index}>{renderLine(item, `li-${index}`, true)}</li>
            ))}
          </ListTag>
        );
        list = null;
      }
    };

    lines.forEach((line, lineIndex) => {
      const uliMatch = /^\s*[-*]\s(.*)/.exec(line);
      const oliMatch = /^\s*\d+\.\s(.*)/.exec(line);
      const key = `line-${lineIndex}`;

      if (uliMatch) {
        if (list?.type !== 'ul') flushList(`flushed-ul-${lineIndex}`);
        if (!list) list = { type: 'ul', items: [] };
        list.items.push(uliMatch[1]);
      } else if (oliMatch) {
        if (list?.type !== 'ol') flushList(`flushed-ol-${lineIndex}`);
        if (!list) list = { type: 'ol', items: [] };
        list.items.push(oliMatch[1]);
      } else {
        flushList(`flushed-p-${lineIndex}`);
        if (line.trim() !== '') {
          elements.push(<div key={key}>{renderLine(line, key, false)}</div>);
        }
      }
    });

    flushList(`final-flush`);

    return <div className="space-y-2">{elements}</div>;
  };

  if (message.role === 'assistant' && isTyping && isLastMessage) {
    return (
      <TypingAnimation
        text={message.content}
        onUpdate={onAnimationUpdate}
        onComplete={onAnimationComplete}
        isTyping={true}
      />
    );
  }

  if (message.role === 'assistant' && isLastMessage && !isTyping) {
    return <TypingAnimation text={message.content} onUpdate={onAnimationUpdate} onComplete={onAnimationComplete} />;
  }

  return <div className="space-y-2">{renderContent(message.content)}</div>;
};

export default ChatMessage;
