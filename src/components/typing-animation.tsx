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
    let htmlContent = '';
    let inUList = false;
    let inOList = false;
  
    lines.forEach((line, index) => {
      let processedLine = line;
  
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

  return <span className={className}>{renderContent(displayedText)}</span>;
};

export default TypingAnimation;
