"use client";

import { cn } from "@/lib/utils";

const TypingDots = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <span className="h-2 w-2 animate-dot-pulse rounded-full bg-muted-foreground [animation-delay:0s]" />
      <span className="h-2 w-2 animate-dot-pulse rounded-full bg-muted-foreground [animation-delay:0.2s]" />
      <span className="h-2 w-2 animate-dot-pulse rounded-full bg-muted-foreground [animation-delay:0.4s]" />
    </div>
  );
};

export default TypingDots;
