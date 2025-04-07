
import React, { useRef, useEffect } from 'react';
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
  
  // Create a ref to store the handler function
  const showBasicsHandlerRef = useRef<(() => void) | null>(null);
  
  // Function to handle showing Google Basics
  const handleGoogleBasicsClick = () => {
    console.log("ChatbotStep: handleGoogleBasicsClick called");
    if (showBasicsHandlerRef.current) {
      showBasicsHandlerRef.current();
    }
  };
  
  // Capture the handler function from GoogleBasicsHandler component
  const captureBasicsHandler = (element: HTMLDivElement | null) => {
    if (element && element.querySelector) {
      const input = element.querySelector('input[data-show-basics]');
      if (input) {
        // @ts-ignore - We know this attribute exists
        showBasicsHandlerRef.current = input.dataset.showBasics;
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
      
      {/* Get a reference to the GoogleBasicsHandler */}
      <div ref={captureBasicsHandler}>
        <GoogleBasicsHandler isFinalPhase={isFinalPhase} />
      </div>
    </>
  );
};

export default ChatbotStep;
