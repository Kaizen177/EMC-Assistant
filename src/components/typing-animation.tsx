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
    let inUlist = false;
    let inOlist = false;

    const processedLines = lines.map(line => {
      let processedLine = line;

      const uliMatch = /^\s*[-*]\s(.*)/.exec(processedLine);
      const oliMatch = /^\s*\d+\.\s(.*)/.exec(processedLine);

      if (uliMatch) {
        let prefix = '';
        if (!inUlist) {
          prefix = '<ul>';
          inUlist = true;
        }
        processedLine = `${prefix}<li>${uliMatch[1]}</li>`;
      } else if (inUlist) {
        processedLine = '</ul>' + processedLine;
        inUlist = false;
      }
      
      if (oliMatch) {
        let prefix = '';
        if (!inOlist) {
          prefix = '<ol>';
          inOlist = true;
        }
        processedLine = `${prefix}<li>${oliMatch[1]}</li>`;
      } else if (inOlist) {
        processedLine = '</ol>' + processedLine;
        inOlist = false;
      }

      processedLine = processedLine.replace(boldRegex, '<strong>$1</strong>');
      return processedLine;
    });

    if (inUlist) processedLines.push('</ul>');
    if (inOlist) processedLines.push('</ol>');

    const processedText = processedLines.join('\n').replace(/<\/ul>\n<ul>/g, '').replace(/<\/ol>\n<ol>/g, '');
    const parts = processedText.split(urlRegex);

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
