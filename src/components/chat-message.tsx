// src/components/chat-message.tsx

"use client";

import React from 'react';
import TypingAnimation from './typing-animation';
import { Button } from './ui/button';
import { Play } from 'lucide-react';
import { isArabic } from '@/lib/utils';
import { cn } from '@/lib/utils';


interface ChatMessageProps {
  message: {
    content: string;
    role: 'user' | 'assistant';
  };
  isLastMessage: boolean;
  isTyping: boolean;
  onAnimationUpdate: () => void;
  onAnimationComplete: () => void;
  onStartTest: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLastMessage, isTyping, onAnimationUpdate, onAnimationComplete, onStartTest }) => {
  
  const handleStartTestClick = () => {
    onStartTest();
  };
  
  const renderContent = (text: string) => {
    const renderLine = (line: string, lineKey: string, isListItem: boolean) => {
      const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
      const boldRegex = /\*\*(.*?)\*\*/g;

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
                className="text-green-700 bg-green-100/50 border border-green-300 px-1.5 py-0.5 rounded-md transition-all duration-200 hover:underline break-words"
              >
                {linkPart}
              </a>
            );
          }
          return <span key={`${lineKey}-text-${index}-${linkIndex}`} dangerouslySetInnerHTML={{ __html: linkPart }} />;
        });
      });
      return isListItem ? <>{content}</> : <p key={lineKey} className="my-4 first:mt-0 last:mb-0 leading-relaxed">{content}</p>;
    };

    if (text.includes('[START_DASS21_TEST]')) {
        const textBeforeButton = text.split('[START_DASS21_TEST]')[0].replace(/[^\p{L}\p{N}\p{P}\p{Z}]*$/u, '').trim();

        return (
            <div className="space-y-4">
                {textBeforeButton && (
                    <div>
                        {renderLine(textBeforeButton, `part-0`, false)}
                    </div>
                )}
                 <div className="mt-4 flex justify-center">
                    <Button 
                        variant="default"
                        size="icon"
                        onClick={handleStartTestClick} 
                        className="w-12 h-12 rounded-full transform hover:scale-110 transition-transform duration-200"
                        aria-label="Start assessment"
                    >
                        <Play className="w-6 h-6" />
                    </Button>
                </div>
            </div>
        );
    }

    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let list: { type: 'ul' | 'ol'; items: string[] } | null = null;
    const isRtl = isArabic(text);

    const flushList = (key: string) => {
      if (list) {
        const ListTag = list.type;
        elements.push(
          <ListTag key={key} className={cn(
            'space-y-1 my-4 first:mt-0 last:mb-0 leading-relaxed',
             isRtl ? 'pr-5 list-disc' : 'pl-5 list-disc'
          )}>
            {list.items.map((item, index) => (
              <li key={`li-${index}`}>{renderLine(item, `li-item-${index}`, true)}</li>
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

  const isRtl = isArabic(message.content);

  if (message.role === 'assistant' && isTyping && isLastMessage) {
    return (
      <TypingAnimation
        text={message.content}
        onUpdate={onAnimationUpdate}
        onComplete={onAnimationComplete}
        isTyping={true}
        onStartTest={onStartTest}
      />
    );
  }

  if (message.role === 'assistant' && isLastMessage && !isTyping) {
    return <TypingAnimation text={message.content} onUpdate={onAnimationUpdate} onComplete={onAnimationComplete} onStartTest={onStartTest}/>;
  }

  return (
    <div className={cn("space-y-2", isRtl ? "text-right" : "text-left")} dir={isRtl ? "rtl" : "ltr"}>
        {renderContent(message.content)}
    </div>
  );
};

export default ChatMessage;
