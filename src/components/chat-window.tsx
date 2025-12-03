
"use client";

import { type FC, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Send, Bot, User, AlertCircle } from "lucide-react";

import { useChat } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import TypingDots from "./typing-dots";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import ChatMessage from "./chat-message";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface ChatWindowProps {
  onClose: () => void;
  className?: string;
}

const ChatFormSchema = z.object({
  message: z.string().min(1, "Message cannot be empty."),
});

type ChatFormValues = z.infer<typeof ChatFormSchema>;

// Helper function to detect if a message is predominantly Arabic
const isPredominantlyArabic = (text: string) => {
  const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const latinChars = (text.match(/[a-zA-Z]/g) || []).length;
  const totalChars = arabicChars + latinChars;

  if (totalChars === 0) {
    return false;
  }

  // Consider the text Arabic if more than 50% of its alphabetic characters are Arabic
  return (arabicChars / totalChars) > 0.5;
};


const ChatWindow: FC<ChatWindowProps> = ({ onClose, className }) => {
  const { messages, isLoading, sendMessage, setMessages } = useChat();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(ChatFormSchema),
    defaultValues: {
      message: "",
    },
  });

  useEffect(() => {
    if (!hasAnimated) {
      setTimeout(() => {
        const greeting = "Bonjour! Je suis l'Assistant EMC. Comment puis-je vous aider aujourd'hui?";
        
        setMessages([
          {
            id: '0',
            role: 'assistant',
            content: greeting,
          }
        ]);
        setHasAnimated(true);
      }, 300);
    }
  }, [hasAnimated, setMessages]);
  
  const onSubmit = (data: ChatFormValues) => {
    if (!data.message.trim()) return; // Prevent empty sends
    sendMessage(data.message);
    form.reset();
    // Reset height immediately after sending
    if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
    }
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollableView = scrollAreaRef.current.querySelector(
        "div[data-radix-scroll-area-viewport]"
      );
      if (scrollableView) {
        scrollableView.scrollTop = scrollableView.scrollHeight;
      }
    }
  };

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isLoading, isAtBottom]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  const { watch, control } = form;
  const messageValue = watch("message");

  // Improved Auto-Grow Logic
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // We reset to 'auto' first so it can shrink if text is deleted
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      
      // We set a max height limit so it doesn't take over the whole screen
      // If content is larger than 150px, it will scroll internally
      textarea.style.height = `${Math.min(scrollHeight, 150)}px`;
    }
  }, [messageValue]);

  const handleScroll = () => {
    const scrollableView = scrollAreaRef.current?.querySelector(
      "div[data-radix-scroll-area-viewport]"
    );
    if (scrollableView) {
      const { scrollTop, scrollHeight, clientHeight } = scrollableView;
      const isScrolledToBottom =
        Math.ceil(scrollTop + clientHeight) >= scrollHeight - 20;
      setIsAtBottom(isScrolledToBottom);
    }
  };

  return (
    <Card
      className={cn(
        "w-full h-full shadow-2xl rounded-2xl flex flex-col bg-card border-0 md:border",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b shrink-0">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot />
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold">EMC Assistant</p>
              <span className="text-xs font-semibold text-green-700 bg-green-100/50 border border-green-300 px-2 py-0.5 rounded-full">
                BETA
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <AlertCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                align="end"
                className="max-w-[300px]"
              >
                Cet assistant IA a des limites. En cas de mal-être ou de
                situation grave, il est important de consulter un professionnel
                qualifié.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent
        className="flex-1 p-0 overflow-hidden flex flex-col min-h-0"
      >
        <ScrollArea 
          className="flex-1 h-full w-full chat-background-pattern" 
          ref={scrollAreaRef}
          onScrollCapture={handleScroll}
        >
          <div className="p-4 space-y-4">
            {messages.map((message, index) => {
              const messageIsArabic = isPredominantlyArabic(message.content);
              return (
              <div
                key={message.id}
                className={cn(
                  "flex items-end gap-2",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2 text-sm break-words",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-card-foreground rounded-bl-none"
                  )}
                   style={{
                    direction: messageIsArabic ? 'rtl' : 'ltr',
                    textAlign: messageIsArabic ? 'right' : 'left',
                  }}
                >
                  <ChatMessage
                    message={message}
                    isLastMessage={index === messages.length - 1}
                    isTyping={isLoading || (index === 0 && messages.length === 1)}
                    onAnimationUpdate={scrollToBottom}
                    onAnimationComplete={scrollToBottom}
                  />
                </div>
                {message.role === "user" && (
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback>
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            )})}
            {isLoading && messages.length > 1 && (
              <div className="flex items-end gap-2 justify-start">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-3 flex items-center">
                  <TypingDots />
                </div>
              </div>
            )}
            <div className="h-2" /> {/* Small spacer at bottom */}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="p-3 pt-0 shrink-0 bg-card rounded-b-2xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full"
          >
            <FormField
              control={control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {/* New Cool Input Container */}
                    <div className="relative flex items-end w-full p-2 bg-background border rounded-2xl shadow-sm transition-all duration-300 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20">
                      <Textarea
                        {...field}
                        ref={textareaRef}
                        placeholder={isInputFocused ? '' : 'Écrivez votre message...'}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        className="flex-1 min-h-[24px] max-h-[150px] bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/70 resize-none py-2 px-2 leading-tight rounded-md"
                        rows={1}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        autoComplete="off"
                        spellCheck="false"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        className={cn(
                            "h-8 w-8 rounded-full ml-1 shrink-0 transition-opacity duration-200 disabled:pointer-events-none",
                            !messageValue || isLoading ? "opacity-50" : "opacity-100"
                        )}
                        disabled={isLoading || !messageValue}
                        aria-label="Send message"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardFooter>
    </Card>
  );
};

export default ChatWindow;
