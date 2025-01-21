import { useState } from 'react';
import { useChat } from './chat-context';
import MessageBubble from './message-bubble';
import { toast } from "sonner";

export default function ChatInterface() {
  const { messages, sendMessage, isLoading } = useChat();
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await sendMessage(input);
    setInput('');
  };

  const handleCopyToInput = (content: string) => {
    setInput(content);
    toast.success("Message copied to input");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, i) => (
          // <MessageBubble key={i} message={message} />
          <MessageBubble
              key={i}
              message={message}
              onCopyToInput={handleCopyToInput}
            />
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border p-2"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
