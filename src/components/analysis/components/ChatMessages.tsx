
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ChatMessage } from '../hooks/useChatbotState';

interface ChatMessagesProps {
  chatHistory: ChatMessage[];
  isTyping: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ chatHistory, isTyping }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

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
            className={`px-4 py-2 rounded-xl max-w-[80%] ${
              msg.sender === 'user' 
                ? 'bg-brand-blue-light text-white rounded-tr-none' 
                : 'bg-gray-700 text-white rounded-tl-none'
            }`}
          >
            {msg.text}
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
            <div className="bg-gray-700 text-white rounded-xl rounded-tl-none px-4 py-2">
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
