"use client";

import { aiPoweredChat, type AIPoweredChatInput } from "@/ai/flows/ai-powered-chat";
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const initialMessage: Message = {
    id: '0',
    role: 'assistant',
    content: "Bonjour! Je suis l'Assistant EMC. Comment puis-je vous aider aujourd'hui?",
};

export const useChat = (initialMessages: Message[] = [initialMessage]) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: message,
      };
      
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setIsLoading(true);

      try {
        const chatHistoryForApi: AIPoweredChatInput['chatHistory'] = newMessages
          .slice(-12) // Keep last 12 messages for memory
          .map(({ role, content }) => ({ role, content }));

        const result = await aiPoweredChat({
          message,
          chatHistory: chatHistoryForApi,
        });
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: result.response,
        };
        
        // Let's add a small delay to simulate typing
        setTimeout(() => {
          setMessages((prev) => [...prev, assistantMessage]);
          setIsLoading(false);
        }, 500);

      } catch (error) {
        console.error("Error with AI chat:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request. Please try again.",
        });
        // Remove the user message that caused the error
        setMessages(prev => prev.slice(0, -1));
        setIsLoading(false);
      }
    },
    [messages, toast]
  );

  return { messages, isLoading, sendMessage };
};
