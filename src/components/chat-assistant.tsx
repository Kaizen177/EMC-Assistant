"use client";

import { useState, useEffect } from "react";
import ChatBubble from "@/components/chat-bubble";
import ChatWindow from "@/components/chat-window";
import { cn } from "@/lib/utils";

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          "fixed bottom-5 right-5 z-[1000] transition-all duration-300 md:bottom-8 md:right-8",
          isOpen ? "opacity-0 scale-75 pointer-events-none" : "opacity-100 scale-100"
        )}
      >
        <ChatBubble isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      </div>

      <div
        className={cn(
          "fixed inset-0 z-[999] transition-opacity duration-300 md:bottom-8 md:right-8 md:left-auto md:top-auto md:h-auto md:w-auto",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <ChatWindow
          className={cn(
            "transform-gpu transition-all duration-300 ease-out origin-bottom-right",
            isOpen ? "scale-100 opacity-100" : "scale-75 opacity-0"
          )}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </>
  );
}
