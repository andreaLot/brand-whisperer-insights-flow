
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
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
  const [showOptions, setShowOptions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isFinalPhase, setIsFinalPhase] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  
  const introBubbles = [
    `Hello! I've just finished analyzing "${businessName}", I can help you understand how your business appears across different AI platforms.`,
    "Would you like to see your current ratings from top AI assistants?",
  ];
  
  // Add intro bubbles in sequence - but only once
  useEffect(() => {
    if (chatHistory.length === 0 && !introComplete) {
      let delay = 0;
      
      introBubbles.forEach((bubble, index) => {
        delay += 1500 + (index * 300);
        
        setTimeout(() => {
          setChatHistory(prev => [...prev, { sender: 'bot', text: bubble }]);
          
          // After the last message is shown, show options and mark intro as complete
          if (index === introBubbles.length - 1) {
            setTimeout(() => {
              setShowOptions(true);
              setIntroComplete(true);
            }, 500);
          }
        }, delay);
      });
      
      // Set typing indicators between messages
      introBubbles.forEach((_, index) => {
        if (index < introBubbles.length) {
          const typingStartTime = index === 0 ? 0 : 1500 + ((index - 1) * 300);
          const typingEndTime = 1500 + (index * 300);
          
          setTimeout(() => setIsTyping(true), typingStartTime);
          setTimeout(() => setIsTyping(false), typingEndTime);
        }
      });
    }
  }, [chatHistory.length, introBubbles, businessName, introComplete]);
  
  const sendMessage = (text: string) => {
    // Add user message to chat
    setChatHistory(prev => [...prev, { sender: 'user', text }]);
    
    // Clear input and show typing indicator
    setMessage('');
    setShowOptions(false);
    setIsTyping(true);
    
    // Show the side panel
    setIsPanelVisible(true);
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      let responseText = '';
      
      // Show ratings panel
      if (text.toLowerCase().includes('ratings') || text.toLowerCase().includes('see ratings')) {
        responseText = `Here are the current ratings for ${businessName} across different AI platforms:`;
        // Post an event for the iframe to receive and show ratings panel
        window.postMessage({ type: 'chatbot-selection', message: 'ratings' }, '*');
        setIsFinalPhase(true);
      } else {
        responseText = `I'll show you the AI platform ratings for ${businessName}.`;
        window.postMessage({ type: 'chatbot-selection', message: 'ratings' }, '*');
        setIsFinalPhase(true);
      }
      
      // Add bot response to chat
      setChatHistory(prev => [...prev, { sender: 'bot', text: responseText }]);
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
        AI Platform <span className="text-brand-blue-light">Analysis</span>
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
      {showOptions && !isFinalPhase && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs bg-violet-500/20 border-violet-400 text-violet-100 hover:bg-violet-500/30"
            onClick={() => sendMessage("Show my ratings across AI platforms")}
          >
            See my ratings
          </Button>
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
      
      {/* Export panel visibility state so it can be accessed by parent components */}
      <input type="hidden" data-panel-visible={isPanelVisible} />
    </div>
  );
};

export default ChatbotStep;
