
import React from 'react';
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
  
  // Get the Google Basics handler
  const { handleShowBasics } = GoogleBasicsHandler({ isFinalPhase });

  return (
    <>
      <ChatbotStepContent 
        chatHistory={chatHistory}
        isTyping={isTyping}
        showOptions={showOptions}
        introComplete={introComplete}
        isFinalPhase={isFinalPhase}
        onOptionClick={sendMessage}
        onShowBasics={handleShowBasics}
      />
      
      {/* Export panel visibility state so it can be accessed by parent components */}
      <ChatPanelVisibility 
        isPanelVisible={isPanelVisible}
        introComplete={introComplete}
        setIsPanelVisible={setIsPanelVisible}
      />
    </>
  );
};

export default ChatbotStep;
