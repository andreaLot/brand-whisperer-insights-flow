
import React, { useEffect } from 'react';
import { AnimatePresence } from "framer-motion";
import ChatMessages from './components/ChatMessages';
import QuickOptions from './components/QuickOptions';
import { useChatbotState } from './hooks/useChatbotState';
import { useIntroSequence } from './hooks/useIntroSequence';

interface ChatbotStepProps {
  primaryCategory?: string;
  location?: string;
  businessName: string;
  onChatComplete: () => void;
}

const ChatbotStep: React.FC<ChatbotStepProps> = ({
  businessName,
  onChatComplete
}) => {
  // Use the chat state hook
  const chatState = useChatbotState({ businessName });
  const {
    chatHistory,
    setChatHistory,
    showOptions,
    setShowOptions,
    isTyping,
    setIsTyping,
    isFinalPhase,
    setIsFinalPhase,
    isPanelVisible,
    setIsPanelVisible,
    introComplete,
    setIntroComplete,
    processedIntroMessages,
    setProcessedIntroMessages,
    introBubbles
  } = chatState;

  // Use the intro sequence hook
  useIntroSequence({
    chatHistory,
    setChatHistory,
    introBubbles,
    setIsTyping,
    setShowOptions,
    setIntroComplete,
    processedIntroMessages,
    setProcessedIntroMessages,
    introComplete
  });
  
  const sendMessage = (text: string) => {
    // Add user message to chat with unique ID
    const userMessageId = `user-${Date.now()}`;
    setChatHistory(prev => [...prev, { sender: 'user', text, id: userMessageId }]);
    
    // Clear input and show typing indicator
    setShowOptions(false);
    setIsTyping(true);
    
    // Show the side panel
    setIsPanelVisible(true);
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      let responseText = '';
      const botMessageId = `bot-${Date.now()}`;
      
      // Show ratings panel
      responseText = `Here are the current ratings for ${businessName} across different AI platforms:`;
      // Post an event for the iframe to receive and show ratings panel
      window.postMessage({ type: 'chatbot-selection', message: 'ratings' }, '*');
      setIsFinalPhase(true);
      
      // Add bot response to chat
      setChatHistory(prev => [...prev, { sender: 'bot', text: responseText, id: botMessageId }]);
      setIsTyping(false);
      
      // Automatically complete the chat process
      setTimeout(() => {
        onChatComplete();
      }, 1000);
    }, 1500); // 1.5 second typing delay
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      <h2 className="text-2xl font-bold">
        AI Platform <span className="text-brand-blue-light">Analysis</span>
      </h2>
      
      <div className="flex-1 overflow-auto p-4 bg-brand-black/50 rounded-lg h-[300px] overflow-y-auto">
        <ChatMessages chatHistory={chatHistory} isTyping={isTyping} />
      </div>
      
      {/* Quick option buttons */}
      <AnimatePresence>
        <QuickOptions 
          showOptions={showOptions} 
          isFinalPhase={isFinalPhase} 
          onOptionClick={sendMessage} 
          forceShow={introComplete && !isFinalPhase}
        />
      </AnimatePresence>
      
      {/* Export panel visibility state so it can be accessed by parent components */}
      <input type="hidden" data-panel-visible={isPanelVisible} />
    </div>
  );
};

export default ChatbotStep;
