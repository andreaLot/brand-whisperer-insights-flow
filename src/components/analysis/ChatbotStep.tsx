
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
      
      // Generate different responses based on the message
      const botMessageId = `bot-${Date.now()}`;
      let responseText = '';
      let panelToShow = 'ratings';
      
      if (text.toLowerCase().includes('profile')) {
        responseText = `Here's the completeness analysis of your Google Business Profile:`;
        panelToShow = 'profile';
      } else if (text.toLowerCase().includes('competitors')) {
        responseText = `Here's how you compare to your competitors:`;
        panelToShow = 'competitors';
      } else if (text.toLowerCase().includes('seo')) {
        responseText = `Here's your SEO analysis:`;
        panelToShow = 'seo';
      } else if (text.toLowerCase().includes('content')) {
        responseText = `Here's your content analysis:`;
        panelToShow = 'content';
      } else {
        responseText = `Here are the current AI platform rankings for ${businessName}:`;
        panelToShow = 'ratings';
      }
      
      // Add bot response to chat
      setChatHistory(prev => [...prev, { sender: 'bot', text: responseText, id: botMessageId }]);
      
      // Mark the interaction as in final phase
      setIsFinalPhase(true);
      
      // Post a message to trigger the appropriate panel
      window.postMessage({ type: 'chatbot-selection', message: panelToShow }, '*');
      
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

  // Don't force the ratings panel to appear on initial load anymore
  useEffect(() => {
    console.log("ChatbotStep: Initial render");
    
    // If we're not in the intro sequence yet, mark the panel as visible
    if (!introComplete) {
      setIsPanelVisible(true);
    }
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
