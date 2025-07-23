
"use client";

import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type AIPoweredChatInput = {
    message: string;
    chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
}

const initialMessage: Message = {
    id: '0',
    role: 'assistant',
    content: "Bonjour! Je suis l'Assistant EMC. Comment puis-je vous aider aujourd'hui?",
};

const warmupApi = async () => {
    try {
        await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ warmup: true }),
        });
    } catch (error) {
        console.warn("API warmup failed:", error);
    }
};

export const useChat = (initialMessages: Message[] = [initialMessage]) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    warmupApi();
  }, []);

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
        const chatHistoryForApi = newMessages
          .filter(msg => msg.id !== '0') 
          .slice(-12) 
          .map(({ role, content }) => ({ role, content }));

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            chatHistory: chatHistoryForApi,
          }),
        });

        if (!response.ok) {
          throw new Error('API response was not ok.');
        }

        const result = await response.json();
        
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
          content: "Désolé, je n'ai pas pu me connecter au service de chat. Veuillez réessayer.",
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
