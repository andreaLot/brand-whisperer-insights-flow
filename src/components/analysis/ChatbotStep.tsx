
import React, { useRef } from 'react';
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
  
  // Use the messaging hook
  const { sendMessage } = useChatbotMessaging({
    setChatHistory,
    setShowOptions,
    setIsTyping,
    setIsPanelVisible,
    setIsFinalPhase,
    onChatComplete
  });
  
  // Create a ref to store the handler function
  const showBasicsHandlerRef = useRef<(() => void) | null>(null);
  
  // Function to handle showing Google Basics
  const handleGoogleBasicsClick = () => {
    if (showBasicsHandlerRef.current) {
      showBasicsHandlerRef.current();
    }
  };
  
  // Function to capture the handler from GoogleBasicsHandler
  const handleGoogleBasicsRef = (element: React.ReactElement) => {
    // Extract the handler from the data attribute
    if (element && element.props && element.props.children) {
      const inputElement = React.Children.toArray(element.props.children)[0] as React.ReactElement;
      if (inputElement && inputElement.props && inputElement.props["data-show-basics"]) {
        showBasicsHandlerRef.current = inputElement.props["data-show-basics"];
      }
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
      
      {/* Render GoogleBasicsHandler but capture its function via ref */}
      {React.createElement(GoogleBasicsHandler, { isFinalPhase }, null)}
    </>
  );
};

export default ChatbotStep;
