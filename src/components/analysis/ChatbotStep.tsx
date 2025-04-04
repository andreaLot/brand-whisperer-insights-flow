
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, Send } from "lucide-react";
import RobotAvatar from "@/components/RobotAvatar";

interface ChatbotStepProps {
  primaryCategory?: string;
  location?: string;
  onChatComplete: () => void;
}

const ChatbotStep: React.FC<ChatbotStepProps> = ({ 
  primaryCategory, 
  location, 
  onChatComplete 
}) => {
  const categoryText = primaryCategory || "your business";
  const locationText = location || "your location";
  
  const [messages, setMessages] = useState<Array<{type: 'bot' | 'user', text: string}>>([
    {
      type: 'bot',
      text: `We've analyzed ${categoryText} in ${locationText} and found some interesting insights. Would you like to see the detailed results now?`
    }
  ]);
  
  const [userInput, setUserInput] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  
  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    // Add user message
    const newMessages = [...messages, {type: 'user', text: userInput}];
    setMessages(newMessages);
    setUserInput('');
    setIsWaiting(true);
    
    // Simulate bot thinking
    setTimeout(() => {
      const botResponse = {
        type: 'bot' as const,
        text: "Great! I'll show you the complete analysis results right away."
      };
      setMessages([...newMessages, botResponse]);
      setIsWaiting(false);
      
      // Wait a moment before completing the chat
      setTimeout(onChatComplete, 1500);
    }, 1500);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 mb-4 space-y-4 overflow-y-auto max-h-[350px]">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.type === 'bot' ? 'justify-start' : 'justify-end'}`}
          >
            {message.type === 'bot' && <RobotAvatar />}
            
            <div 
              className={`px-4 py-2 rounded-lg max-w-[80%] ${
                message.type === 'bot' 
                  ? 'ml-2 bg-brand-gray-dark border border-gray-700' 
                  : 'mr-2 bg-brand-blue-dark'
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
            
            {message.type === 'user' && (
              <div className="w-10 h-10 bg-brand-blue-light rounded-full flex items-center justify-center">
                <MessageCircle size={20} />
              </div>
            )}
          </div>
        ))}
        
        {isWaiting && (
          <div className="flex justify-start">
            <RobotAvatar />
            <div className="ml-2 px-4 py-2 rounded-lg bg-brand-gray-dark border border-gray-700">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex gap-2 mt-auto">
        <div className="flex-1 relative">
          <textarea
            className="w-full bg-brand-gray-dark border border-gray-700 rounded-lg p-3 pr-10 resize-none text-sm"
            rows={1}
            placeholder="Type your response..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isWaiting}
          />
        </div>
        <Button 
          variant="default" 
          size="icon" 
          onClick={handleSendMessage}
          disabled={!userInput.trim() || isWaiting}
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ChatbotStep;
