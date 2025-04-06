
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
    
    // Clear options and show typing indicator
    setShowOptions(false);
    setIsTyping(true);
    
    // Show the side panel immediately
    setIsPanelVisible(true);
    
    // After a small delay to simulate typing
    setTimeout(() => {
      setIsTyping(false);
      
      // Show ratings panel with bot response
      const botMessageId = `bot-${Date.now()}`;
      const responseText = `Here are the current AI platform rankings for ${businessName}:`;
      
      // Add bot response to chat
      setChatHistory(prev => [...prev, { sender: 'bot', text: responseText, id: botMessageId }]);
      
      // Mark the interaction as in final phase
      setIsFinalPhase(true);
      
      // Post a message to trigger the ratings panel
      window.postMessage({ type: 'chatbot-selection', message: 'ratings' }, '*');
      
      // Explicitly call onChatComplete to trigger any parent component logic
      setTimeout(() => {
        console.log("ChatbotStep: Calling onChatComplete");
        onChatComplete();
      }, 500);
    }, 800);
  };
  
  // Send message to show ratings panel when we're in final phase
  useEffect(() => {
    if (isFinalPhase) {
      // Explicitly trigger the ratings panel to appear
      console.log("ChatbotStep: Triggering ratings panel (isFinalPhase effect)");
      window.postMessage({ type: 'chatbot-selection', message: 'ratings' }, '*');
    }
  }, [isFinalPhase]);

  // Force the ratings panel to appear on initial load
  useEffect(() => {
    console.log("ChatbotStep: Initial render, forcing ratings panel to appear");
    
    // Small delay to ensure listeners are set up
    const timer = setTimeout(() => {
      window.postMessage({ type: 'chatbot-selection', message: 'ratings' }, '*');
      
      // If we're not in the intro sequence yet, mark the panel as visible
      if (!introComplete) {
        setIsPanelVisible(true);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col space-y-4 w-full">
      <h2 className="text-3xl font-bold">
        AI Platform <span className="text-brand-blue-light">Rankings</span>
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
