"use client";

import { useState, useEffect, useRef } from 'react';

interface TypingAnimationProps {
  text: string;
  speed?: number;
  className?: string;
  onUpdate?: () => void;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({ text, speed = 10, className, onUpdate }) => {
  const [displayedText, setDisplayedText] = useState('');
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

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
        }
      }, speed);

      return () => clearInterval(intervalId);
    }
  }, [text, speed]);

  const renderContent = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    const boldRegex = /\*\*(.*?)\*\*/g;
  
    const lines = text.split('\n');
    let inUList = false;
    let inOList = false;
  
    const renderedLines = lines.map((line) => {
      let processedLine = line;
  
      const uliMatch = /^\s*[-*]\s(.*)/.exec(processedLine);
      const oliMatch = /^\s*\d+\.\s(.*)/.exec(processedLine);
  
      if (uliMatch) {
        if (inOList) {
          inOList = false;
          return `</ol><ul><li>${uliMatch[1]}</li>`;
        }
        if (!inUList) {
          inUList = true;
          return `<ul><li>${uliMatch[1]}</li>`;
        }
        return `<li>${uliMatch[1]}</li>`;
      } else if (oliMatch) {
        if (inUList) {
          inUList = false;
          return `</ul><ol><li>${oliMatch[1]}</li>`;
        }
        if (!inOList) {
          inOList = true;
          return `<ol><li>${oliMatch[1]}</li>`;
        }
        return `<li>${oliMatch[1]}</li>`;
      } else {
        let closingTags = '';
        if (inUList) {
          closingTags += '</ul>';
          inUList = false;
        }
        if (inOList) {
          closingTags += '</ol>';
          inOList = false;
        }
        if (processedLine.trim() === '') {
          return `${closingTags}<br/>`;
        }
        return `${closingTags}<p>${processedLine}</p>`;
      }
    });
  
    let htmlContent = renderedLines.join('');
    if (inUList) htmlContent += '</ul>';
    if (inOList) htmlContent += '</ol>';
  
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
            className="text-accent-foreground bg-accent px-1.5 py-0.5 rounded-md hover:underline font-bold"
          >
            {part}
          </a>
        );
      }
      return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
    });
  };

  return <span className={className}>{renderContent(displayedText)}</span>;
};

export default TypingAnimation;
