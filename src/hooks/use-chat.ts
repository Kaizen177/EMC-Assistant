
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
          .filter(msg => msg.id !== '0') 
          .slice(-12) 
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
        
        setMessages((prev) => [...prev, assistantMessage]);

      } catch (error) {
        console.error("Error with AI chat:", error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "Désolé, une erreur est survenue. Veuillez réessayer plus tard.",
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, toast]
  );

  return { messages, isLoading, sendMessage };
};
