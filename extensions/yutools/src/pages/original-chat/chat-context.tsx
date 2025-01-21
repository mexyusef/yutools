import { createContext, useContext, useState, ReactNode } from 'react';

type Message = {
  content: string;
  sender: 'user' | 'system';
  timestamp: Date;
};

type ChatContextType = {
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function sendMessage(content: string) {
    try {
      setIsLoading(true);
      
      // Add user message
      const userMessage = {
        content,
        sender: 'user' as const,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);

      // Send to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.content,
          })),
        }),
      });

      const data = await response.json();
      
      // Add AI response
      const aiMessage = {
        content: data.message.content,
        sender: 'system' as const,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ChatContext.Provider value={{ messages, sendMessage, isLoading }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
} 