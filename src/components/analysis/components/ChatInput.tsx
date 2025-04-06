
import React from 'react';
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ message, setMessage, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your question..."
        className="flex-1 bg-brand-gray-dark border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-brand-blue-light"
      />
      <Button type="submit" variant="default" size="icon" disabled={!message.trim()}>
        <Send size={16} />
      </Button>
    </form>
  );
};

export default ChatInput;
