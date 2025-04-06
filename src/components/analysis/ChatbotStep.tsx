
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, ArrowRightCircle } from "lucide-react";
import CompletionButton from './components/CompletionButton';

interface ChatbotStepProps {
  primaryCategory?: string;
  location?: string;
  businessName: string;
  onChatComplete: () => void;
}

const ChatbotStep: React.FC<ChatbotStepProps> = ({
  primaryCategory,
  location,
  businessName,
  onChatComplete
}) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'bot', text: string }>>([]);
  const [showOptions, setShowOptions] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isFinalPhase, setIsFinalPhase] = useState(false);
  
  const chatOptions = [
    "Tell me about my competitors",
    "What about SEO for my business?",
    "Content ideas for my business",
  ];

  // Add initial bot message as soon as the component renders
  useEffect(() => {
    setChatHistory([
      {
        sender: 'bot',
        text: `Hi there! I can help provide insights about "${businessName}" as a ${primaryCategory} in ${location}. What would you like to know?`
      }
    ]);
  }, [businessName, primaryCategory, location]);

  const sendMessage = (text: string) => {
    // Add user message to chat
    setChatHistory(prev => [...prev, { sender: 'user', text }]);
    
    // Clear input and show typing indicator
    setMessage('');
    setShowOptions(false);
    setIsTyping(true);
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      let responseText = '';
      
      // Customize responses based on user message
      if (text.toLowerCase().includes('competitor')) {
        responseText = `I'll analyze the top competitors for ${businessName} in ${location} as a ${primaryCategory} business.`;
        // Post an event for the iframe to receive and show competitors panel
        window.postMessage({ type: 'chatbot-selection', message: 'competitors' }, '*');
      } else if (text.toLowerCase().includes('seo')) {
        responseText = `Here are some SEO opportunities for ${businessName} as a ${primaryCategory} business in ${location}:`;
        // Post an event to show SEO panel
        window.postMessage({ type: 'chatbot-selection', message: 'SEO' }, '*');
      } else if (text.toLowerCase().includes('content')) {
        responseText = `I'll suggest some content ideas for ${businessName} as a ${primaryCategory} business:`;
        // Post an event to show content panel
        window.postMessage({ type: 'chatbot-selection', message: 'Content' }, '*'); 
      } else {
        responseText = `I understand you're interested in ${text} for ${businessName}. Let me analyze that for you.`;
      }
      
      // Add bot response to chat
      setChatHistory(prev => [...prev, { sender: 'bot', text: responseText }]);
      
      // Show completion option after a few interactions
      if (chatHistory.length >= 3) {
        setIsFinalPhase(true);
      }
      
      setIsTyping(false);
    }, 1500); // 1.5 second typing delay
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message.trim());
    }
  };

  // Render chat messages
  const renderChatMessages = () => {
    return chatHistory.map((msg, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`px-4 py-2 rounded-xl max-w-[80%] ${
            msg.sender === 'user' 
              ? 'bg-brand-blue-light text-white rounded-tr-none' 
              : 'bg-gray-700 text-white rounded-tl-none'
          }`}
        >
          {msg.text}
        </div>
      </motion.div>
    ));
  };

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-xl font-normal">
        Ask me about <span className="text-brand-blue-light">your business</span>
      </h2>
      
      <div className="flex-1 overflow-auto p-4 bg-brand-black/50 rounded-lg h-[300px] overflow-y-auto">
        {renderChatMessages()}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-700 text-white rounded-xl rounded-tl-none px-4 py-2">
              <span className="flex space-x-1">
                <span className="typing-dot"></span>
                <span className="typing-dot animation-delay-200"></span>
                <span className="typing-dot animation-delay-400"></span>
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Quick option buttons */}
      {showOptions && (
        <div className="flex flex-wrap gap-2">
          {chatOptions.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => sendMessage(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      )}
      
      {/* Message input form */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
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
      
      {/* Show complete button after sufficient interaction */}
      {isFinalPhase && (
        <CompletionButton onAnalysisComplete={onChatComplete} />
      )}
    </div>
  );
};

export default ChatbotStep;
