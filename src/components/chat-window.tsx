
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

const ChatWindow: FC<ChatWindowProps> = ({ onClose, className }) => {
  const { messages, isLoading, sendMessage } = useChat();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(ChatFormSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = (data: ChatFormValues) => {
    sendMessage(data.message);
    form.reset();
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollableView = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if(scrollableView) {
          scrollableView.scrollTop = scrollableView.scrollHeight;
      }
    }
  };

  useEffect(() => {
    if(isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isLoading, isAtBottom]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };
  
  const { watch, control } = form;
  const messageValue = watch("message");

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; 
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 120;
      if (scrollHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`;
        textarea.style.overflowY = 'auto';
      } else {
        textarea.style.height = `${scrollHeight}px`;
        textarea.style.overflowY = 'hidden';
      }
    }
  }, [messageValue]);

  const handleScroll = () => {
    const scrollableView = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (scrollableView) {
      const { scrollTop, scrollHeight, clientHeight } = scrollableView;
      const isScrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight - 20;
      setIsAtBottom(isScrolledToBottom);
    }
  };


  return (
    <Card
      className={cn(
        "w-full h-full md:w-[400px] md:h-[600px] shadow-2xl rounded-t-2xl md:rounded-2xl flex flex-col bg-card",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
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
              <span className="text-xs font-semibold text-[hsl(var(--beta))] bg-destructive/10 px-1.5 py-0.5 rounded-md">
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
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <AlertCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                align="end"
                className="max-w-[300px]"
              >
                Cet assistant IA a des limites. En cas de mal-être ou de situation grave, il est important de consulter un professionnel qualifié.
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
      <CardContent className="flex-1 p-0 overflow-y-auto" onScroll={handleScroll}>
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-end gap-2",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-card-foreground rounded-bl-none"
                  )}
                >
                  <ChatMessage 
                    message={message}
                    isLastMessage={index === messages.length - 1}
                    isTyping={isLoading}
                    onAnimationUpdate={scrollToBottom}
                    onAnimationComplete={scrollToBottom}
                  />
                </div>
                {message.role === "user" && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
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
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-2 border-t">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full items-end space-x-2"
          >
            <FormField
              control={control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea
                      ref={textareaRef}
                      placeholder={"Écrivez votre message..."}
                      className="resize-none border-input focus-visible:ring-0 focus-visible:ring-offset-0 overflow-y-auto bg-muted/50"
                      rows={1}
                      onKeyDown={handleKeyDown}
                      {...field}
                      disabled={isLoading}
                      autoComplete="off"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="icon"
              className="flex-shrink-0 rounded-md"
              disabled={isLoading || !messageValue}
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </Form>
      </CardFooter>
    </Card>
  );
};

export default ChatWindow;
