"use client";

import { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

interface TypingAnimationProps {
  text: string;
  speed?: number;
  className?: string;
  onUpdate?: () => void;
  onComplete?: () => void;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({ text, speed = 10, className, onUpdate, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const onUpdateRef = useRef(onUpdate);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);
  
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setDisplayedText('');
    if (text) {
      let i = 0;
      const intervalId = setInterval(() => {
        setDisplayedText(text.substring(0, i + 1));
        if (onUpdateRef.current) {
          onUpdateRef.current();
        }
        i++;
        if (i >= text.length) {
          clearInterval(intervalId);
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
        }
      }, speed);

      return () => clearInterval(intervalId);
    }
  }, [text, speed]);

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
              className="text-accent-foreground bg-accent/80 border border-accent-foreground/30 px-1.5 py-0.5 rounded-md transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
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

    const renderedElements = elements.map((el, i) => {
        if(typeof el === 'string') {
            return <p key={`p-${i}`} className="my-4 first:mt-0 last:mb-0">{processLine(el, `p-line-${i}`)}</p>
        }
        return el;
    });

    return <div className={cn("space-y-2", className)}>{renderedElements}</div>;
  };


  return renderContent(displayedText);
};

export default TypingAnimation;
