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

  return <span className={className}>{renderContent(displayedText)}</span>;
};

export default TypingAnimation;
