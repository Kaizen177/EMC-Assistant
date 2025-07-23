"use client";

import { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

interface TypingAnimationProps {
  text: string;
  speed?: number;
  className?: string;
  onUpdate?: () => void;
  onComplete?: () => void;
  isTyping?: boolean;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({ text, speed = 10, className, onUpdate, onComplete, isTyping = false }) => {
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
  
  const renderContent = (textToRender: string) => {
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
                            className="text-green-700 bg-green-100/50 border border-green-300 px-1.5 py-0.5 rounded-md transition-all duration-200 hover:underline break-all"
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

    const lines = textToRender.split('\n');
    const elements: JSX.Element[] = [];
    let list: { type: 'ul' | 'ol'; items: string[] } | null = null;

    const flushList = (key: string) => {
        if (list) {
            const ListTag = list.type;
            elements.push(
                <ListTag key={key} className={(ListTag === 'ul' ? 'list-disc' : 'list-decimal') + ' pl-5 space-y-1 my-4 first:mt-0 last:mb-0 leading-relaxed'}>
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
    
    return elements;
  };
  
  if (isTyping && !displayedText) {
    return null;
  }

  const renderedElements = renderContent(displayedText);
  return <div className={cn("space-y-2", className)}>{renderedElements}</div>;
};

export default TypingAnimation;
