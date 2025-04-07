
import React, { useRef, useEffect, useState } from 'react';
import { useChatbotState } from './hooks/useChatbotState';
import { useIntroSequence } from './hooks/useIntroSequence';
import { useChatbotMessaging } from './hooks/useChatbotMessaging';
import GoogleBasicsHandler from './components/GoogleBasicsHandler';
import ChatbotStepContent from './components/ChatbotStepContent';
import ChatPanelVisibility from './components/ChatPanelVisibility';

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
  
  // Log initial render once to help debugging
  useEffect(() => {
    console.log("ChatbotStep: Initial render");
  }, []);
  
  // Use the messaging hook
  const { sendMessage } = useChatbotMessaging({
    setChatHistory,
    setShowOptions,
    setIsTyping,
    setIsPanelVisible,
    setIsFinalPhase,
    onChatComplete
  });
  
  // Create a state to store the handler function
  const [showBasicsHandler, setShowBasicsHandler] = useState<(() => void) | null>(null);
  
  // Function to handle showing Google Basics
  const handleGoogleBasicsClick = () => {
    console.log("ChatbotStep: handleGoogleBasicsClick called");
    if (showBasicsHandler) {
      showBasicsHandler();
    } else {
      console.error("No show basics handler available");
    }
  };

  return (
    <>
      <ChatbotStepContent 
        chatHistory={chatHistory}
        isTyping={isTyping}
        showOptions={showOptions}
        introComplete={introComplete}
        isFinalPhase={isFinalPhase}
        onOptionClick={sendMessage}
        onShowBasics={handleGoogleBasicsClick}
      />
      
      {/* Export panel visibility state so it can be accessed by parent components */}
      <ChatPanelVisibility 
        isPanelVisible={isPanelVisible}
        introComplete={introComplete}
        setIsPanelVisible={setIsPanelVisible}
      />
      
      {/* Get a reference to the GoogleBasicsHandler */}
      <GoogleBasicsHandler 
        isFinalPhase={isFinalPhase}
        onShowBasicsInit={setShowBasicsHandler}
      />
    </>
  );
};

export default ChatbotStep;
