"use client";

import { type FC, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Send, Bot, User } from "lucide-react";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import TypingAnimation from "./typing-animation";
import { Textarea } from "./ui/textarea";
import TypingDots from "./typing-dots";

interface ChatWindowProps {
  onClose: () => void;
  className?: string;
}

const ChatFormSchema = z.object({
  message: z.string().min(1, "Message cannot be empty."),
});

type ChatFormValues = z.infer<typeof ChatFormSchema>;

const ChatWindow: FC<ChatWindowProps> = ({ onClose, className }) => {
  const { messages, isLoading, sendMessage } = useChat([
    {
      id: "init",
      role: "assistant",
      content: "Hello! I'm the EMC Assistant (Beta). How can I help you today?",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };
  
  const { watch, control, setValue } = form;
  const messageValue = watch("message");

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height to recalculate
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [messageValue]);


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
            <p className="text-lg font-semibold">EMC Assistant</p>
            <p className="text-sm text-muted-foreground">Online</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
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
                  {message.role === 'assistant' && isLoading && index === messages.length -1 ? (
                    <TypingAnimation text={message.content} speed={10}/>
                  ) : message.role === 'assistant' && index === messages.length - 1 ? (
                    <TypingAnimation text={message.content} speed={10}/>
                  ) : (
                    message.content
                  )}
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
            <div ref={messagesEndRef} />
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
                    placeholder="Type a message..."
                    className="resize-none min-h-[48px] focus:placeholder-transparent"
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
              className="rounded-full flex-shrink-0"
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
