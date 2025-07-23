
"use client";

import type { FC } from "react";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface ChatBubbleProps {
  onClick: () => void;
  isOpen: boolean;
  isPulsing?: boolean;
}

const ChatBubble: FC<ChatBubbleProps> = ({ onClick, isOpen, isPulsing }) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            className={cn(
              "rounded-full w-16 h-16 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all transform hover:scale-110 active:scale-100",
              "flex items-center justify-center relative overflow-hidden",
              isPulsing && !isOpen && "animate-pulse-subtle"
            )}
            aria-label={isOpen ? "Close chat" : "Open chat"}
          >
            <div
              className={cn(
                "transition-transform duration-300 ease-in-out absolute",
                isOpen ? "rotate-90 scale-0" : "rotate-0 scale-100"
              )}
            >
              <MessageSquare className="w-8 h-8" />
            </div>
            <div
              className={cn(
                "absolute transition-transform duration-300 ease-in-out",
                isOpen ? "rotate-0 scale-100" : "-rotate-90 scale-0"
              )}
            >
              <X className="w-8 h-8" />
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" className="bg-accent text-accent-foreground">
          <p>EMC Assistant</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ChatBubble;
