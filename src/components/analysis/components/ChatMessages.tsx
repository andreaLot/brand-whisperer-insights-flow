
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ChatMessage } from '../hooks/useChatbotState';
import { Button } from '@/components/ui/button';

interface ChatMessagesProps {
  chatHistory: ChatMessage[];
  isTyping: boolean;
  onShowBasics?: () => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ chatHistory, isTyping, onShowBasics }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);
  
  // Function to show reviews panel
  const handleShowReviews = () => {
    console.log("ChatMessages: Show reviews button clicked");
    window.postMessage({ 
      type: 'show-reviews-click', 
      detail: { timestamp: Date.now() } 
    }, '*');
    
    // Then send the panel selection message with a small delay 
    setTimeout(() => {
      console.log("ChatMessages: Sending chatbot-selection for reviews");
      window.postMessage({ type: 'chatbot-selection', message: 'reviews' }, '*');
    }, 50);
  };
  
  // Function to show review sentiment
  const handleShowSentiment = () => {
    console.log("ChatMessages: Show sentiment button clicked");
    window.postMessage({ 
      type: 'show-reviews-click', 
      detail: { timestamp: Date.now() } 
    }, '*');
    
    // Then send the panel selection message with a small delay 
    setTimeout(() => {
      console.log("ChatMessages: Sending chatbot-selection for reviews");
      window.postMessage({ type: 'chatbot-selection', message: 'reviews' }, '*');
    }, 50);
  };

  return (
    <>
      {/* Render chat messages with animations */}
      {chatHistory.map((msg) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.19, 1.0, 0.22, 1.0] }}
          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
        >
          <div
            className={`px-4 py-2 rounded-xl max-w-[80%] shadow-lg border ${
              msg.sender === 'user' 
                ? 'bg-gradient-to-br from-uberall-rosa to-uberall-rosa/90 text-white rounded-tr-none border-uberall-rosa/20 shadow-uberall-rosa/20' 
                : 'bg-gradient-to-br from-uberall-ultraviolet to-uberall-dark-plum text-white rounded-tl-none border-uberall-ultraviolet/20 shadow-uberall-ultraviolet/20'
            }`}
            style={{
              boxShadow: msg.sender === 'user' 
                ? '0 4px 12px rgba(255, 123, 186, 0.3)' 
                : '0 4px 12px rgba(117, 21, 245, 0.3)'
            }}
          >
            {msg.text}
            
            {/* Show the Google Basics CTA button if this message has showCTA flag */}
            {msg.showCTA && onShowBasics && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 mb-2"
              >
                <Button 
                  size="sm" 
                  variant="dynamic"
                  onClick={onShowBasics}
                  className="w-full bg-uberall-bold-green hover:bg-uberall-bold-green/90 text-white shadow-md shadow-uberall-bold-green/20"
                >
                  Show me the basics
                </Button>
              </motion.div>
            )}
            
            {/* Show the Reviews CTA buttons if this message has showReviewCTA flag */}
            {msg.showReviewCTA && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 mb-2 space-y-2"
              >
                <Button 
                  size="sm" 
                  variant="dynamic"
                  onClick={handleShowReviews}
                  className="w-full bg-uberall-bright-blue hover:bg-uberall-bright-blue/90 text-white shadow-md shadow-uberall-bright-blue/20"
                >
                  Show my review score
                </Button>
                
                <Button 
                  size="sm" 
                  variant="dynamic"
                  onClick={handleShowSentiment}
                  className="w-full bg-uberall-tangerine hover:bg-uberall-tangerine/90 text-white shadow-md shadow-uberall-tangerine/20"
                >
                  Show my review sentiment
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}
      
      {/* Typing indicator */}
      <AnimatePresence>
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-start mb-4"
          >
            <div 
              className="bg-gradient-to-br from-uberall-ultraviolet to-uberall-dark-plum text-white rounded-xl rounded-tl-none px-4 py-2 border border-uberall-ultraviolet/20 shadow-lg"
              style={{ boxShadow: '0 4px 12px rgba(117, 21, 245, 0.3)' }}
            >
              <span className="flex space-x-1">
                <span className="typing-dot"></span>
                <span className="typing-dot animation-delay-200"></span>
                <span className="typing-dot animation-delay-400"></span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Invisible div for auto-scrolling */}
      <div ref={messagesEndRef} />
    </>
  );
};

export default ChatMessages;
