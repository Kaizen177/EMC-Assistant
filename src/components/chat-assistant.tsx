
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
  const bubbleRef = useRef<HTMLDivElement>(null);

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
        !chatWindowRef.current.contains(event.target as Node) &&
        bubbleRef.current &&
        !bubbleRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
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
        ref={bubbleRef}
        className={cn(
          "fixed bottom-5 right-5 z-[1000] flex items-end gap-3 transition-all duration-300 md:bottom-8 md:right-8",
           isOpen && "hidden"
        )}
      >
        <div
          onMouseEnter={() => setIsPulsing(true)}
          onMouseLeave={() => setIsPulsing(false)}
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
          "fixed inset-0 z-[999] transition-all duration-300 md:bottom-8 md:right-8 md:left-auto md:top-auto md:h-[600px] md:max-h-[calc(100vh-4rem)] md:w-[400px]",
          isOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
        )}
      >
        <ChatWindow
          className={cn(
            "transform-gpu origin-bottom-right transition-all duration-300 ease-out h-full w-full",
            isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
          )}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </>
  );
}
