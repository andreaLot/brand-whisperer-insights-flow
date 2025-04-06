
import { useState } from 'react';
import { ChatMessage } from './useChatbotState';

interface UseChatbotMessagingProps {
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setShowOptions: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPanelVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFinalPhase: React.Dispatch<React.SetStateAction<boolean>>;
  onChatComplete: () => void;
}

export const useChatbotMessaging = ({
  setChatHistory,
  setShowOptions,
  setIsTyping,
  setIsPanelVisible,
  setIsFinalPhase,
  onChatComplete
}: UseChatbotMessagingProps) => {
  
  const sendMessage = (text: string) => {
    // Add user message to chat with unique ID
    const userMessageId = `user-${Date.now()}`;
    setChatHistory(prev => [...prev, { sender: 'user', text, id: userMessageId }]);
    
    // Clear options and show typing indicator
    setShowOptions(false);
    setIsTyping(true);
    
    // Show the side panel immediately
    setIsPanelVisible(true);
    
    // After a delay to simulate typing (consistent 2 seconds)
    setTimeout(() => {
      setIsTyping(false);
      
      // Show ratings panel without any introductory text
      // We trigger the panel to appear but don't add a text message about it
      window.postMessage({ type: 'chatbot-selection', message: 'ratings' }, '*');
      
      // Mark the interaction as in final phase
      setIsFinalPhase(true);
      
      // Add a reminder about Google basics after a delay (consistent 2 seconds)
      setTimeout(() => {
        const googleReminderMessageId = `bot-google-${Date.now()}`;
        const googleReminderText = `Don't forget the basics! While AI platforms are important, your Google Business Profile is still essential. Let me show you the completeness of your profile:`;
        
        // Add Google reminder to chat
        setChatHistory(prev => [...prev, { 
          sender: 'bot', 
          text: googleReminderText, 
          id: googleReminderMessageId,
          showCTA: true // Add flag to show CTA
        }]);
      }, 2000); // Consistent 2 second delay
      
      // Explicitly call onChatComplete to trigger any parent component logic (increased timing)
      setTimeout(() => {
        console.log("ChatbotStep: Calling onChatComplete");
        onChatComplete();
      }, 4000); // Keep as 4s to allow time for user to see the final message
    }, 2000); // Consistent 2 second delay
  };

  return { sendMessage };
};
