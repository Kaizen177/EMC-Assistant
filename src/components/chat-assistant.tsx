
"use client";

import { useState, useEffect } from "react";
import ChatBubble from "@/components/chat-bubble";
import ChatWindow from "@/components/chat-window";
import { cn } from "@/lib/utils";

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const greetingTimer = setTimeout(() => {
      setShowGreeting(true);
    }, 1000); // Show after 1 second

    const hideTimer = setTimeout(() => {
      setShowGreeting(false);
    }, 8000); // Hide after 8 seconds

    return () => {
      clearTimeout(greetingTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleBubbleClick = () => {
    setIsOpen(!isOpen);
    setShowGreeting(false); // Hide greeting when chat is opened
  };

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
          className={cn(
            "mb-2 w-52 rounded-lg bg-primary px-4 py-3 text-sm text-primary-foreground shadow-lg transition-all duration-300 ease-in-out",
            "relative before:absolute before:bottom-2 before:-right-2 before:h-0 before:w-0 before:border-b-[10px] before:border-l-[10px] before:border-b-transparent before:border-l-primary",
            showGreeting && !isOpen
              ? "translate-x-0 opacity-100"
              : "translate-x-4 opacity-0",
            isOpen ? "hidden" : "" // Immediately hide when chat opens
          )}
        >
          Bonjour! Je suis là pour vous aider. N'hésitez pas à me poser une question.
        </div>
        <div
          className={cn(
            "transition-all duration-300",
            isOpen ? "pointer-events-none scale-75 opacity-0" : "scale-100 opacity-100"
          )}
        >
          <ChatBubble isOpen={isOpen} onClick={handleBubbleClick} />
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-[999] transition-opacity duration-300 md:bottom-8 md:right-8 md:left-auto md:top-auto md:h-auto md:w-auto",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <ChatWindow
          className={cn(
            "transform-gpu origin-bottom-right transition-all duration-300 ease-out",
            isOpen ? "scale-100 opacity-100" : "scale-75 opacity-0"
          )}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </>
  );
}
