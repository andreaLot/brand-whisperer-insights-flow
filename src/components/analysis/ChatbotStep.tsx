
import React, { useEffect } from 'react';
import { AnimatePresence } from "framer-motion";
import ChatMessages from './components/ChatMessages';
import QuickOptions from './components/QuickOptions';
import ChatInput from './components/ChatInput';
import CompletionButton from './components/CompletionButton';
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
    message,
    setMessage,
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
    setMessage('');
    setShowOptions(false);
    setIsTyping(true);
    
    // Show the side panel
    setIsPanelVisible(true);
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      let responseText = '';
      const botMessageId = `bot-${Date.now()}`;
      
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
      setChatHistory(prev => [...prev, { sender: 'bot', text: responseText, id: botMessageId }]);
      setIsTyping(false);
    }, 1500); // 1.5 second typing delay
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message.trim());
    }
  };

  // When "View Results" is clicked, show the platform ratings
  const handleViewResults = () => {
    // Show the ratings panel
    window.postMessage({ type: 'chatbot-selection', message: 'ratings' }, '*');
    // Signal that panel should be visible
    setIsPanelVisible(true);
    onChatComplete();
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      <h2 className="text-xl font-normal">
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
        />
      </AnimatePresence>
      
      {/* Message input form */}
      <ChatInput
        message={message}
        setMessage={setMessage}
        onSubmit={handleSubmit}
      />
      
      {/* Show complete button after sufficient interaction */}
      <AnimatePresence>
        {(introComplete && !isFinalPhase) && (
          <CompletionButton onAnalysisComplete={handleViewResults} />
        )}
      </AnimatePresence>
      
      {/* Export panel visibility state so it can be accessed by parent components */}
      <input type="hidden" data-panel-visible={isPanelVisible} />
    </div>
  );
};

export default ChatbotStep;
