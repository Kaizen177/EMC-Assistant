
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
    }, 5000); // Hide after 5 seconds total (1s delay + 4s visible)

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
          "fixed bottom-5 right-5 z-[1000] flex items-center gap-3 transition-all duration-300 md:bottom-8 md:right-8"
        )}
      >
        <div
          className={cn(
            "w-auto rounded-lg bg-muted px-4 py-2 text-sm text-muted-foreground shadow-lg transition-all duration-500 ease-in-out",
            "relative before:absolute before:bottom-1/2 before:-right-2 before:h-0 before:w-0 before:translate-y-1/2 before:border-b-[8px] before:border-l-[8px] before:border-t-[8px] before:border-b-transparent before:border-t-transparent before:border-l-muted",
            showGreeting && !isOpen
              ? "translate-x-0 opacity-100"
              : "translate-x-4 opacity-0",
            isOpen ? "hidden" : "" // Immediately hide when chat opens
          )}
        >
          L'assistant EMC est là pour vous aider.
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
