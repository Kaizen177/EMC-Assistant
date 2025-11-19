"use client";

import { useState, useEffect, useRef } from "react";
import ChatBubble from "@/components/chat-bubble";
import ChatWindow from "@/components/chat-window";
import { cn } from "@/lib/utils";

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    
    const pulseTimer = setTimeout(() => {
      setIsPulsing(false); // Stop pulsing after 5 seconds
    }, 5000);

    return () => {
      clearTimeout(pulseTimer);
    };
  }, []);

  const handleBubbleClick = () => {
    setIsOpen(!isOpen);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        chatWindowRef.current &&
        !chatWindowRef.current.contains(event.target as Node)
      ) {
        // We check if the click is on the bubble itself to prevent immediate re-opening
        const bubble = document.querySelector('[aria-label="Close chat"]');
        if (!bubble || !bubble.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isClient) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          "fixed bottom-5 right-5 z-[1000] flex items-end gap-3 transition-all duration-300 md:bottom-8 md:right-8"
        )}
      >
        <div
          onMouseEnter={() => setIsPulsing(true)}
          onMouseLeave={() => setIsPulsing(false)}
          className={cn(
            "transition-all duration-300",
            isOpen ? "pointer-events-none scale-75 opacity-0" : "scale-100 opacity-100"
          )}
        >
          <ChatBubble 
            isOpen={isOpen} 
            onClick={handleBubbleClick} 
            isPulsing={isPulsing}
          />
        </div>
      </div>

      <div
        ref={chatWindowRef}
        className={cn(
          "fixed inset-0 z-[999] transition-all duration-300 md:bottom-8 md:right-8 md:left-auto md:top-auto md:h-auto md:w-auto",
          isOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
        )}
      >
        <ChatWindow
          className={cn(
            "transform-gpu origin-bottom-right transition-all duration-300 ease-out h-full max-h-full md:max-h-[600px]",
            isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
          )}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </>
  );
}
