
import { useEffect } from 'react';
import { ChatMessage } from './useChatbotState';

interface UseIntroSequenceProps {
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  introBubbles: string[];
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setShowOptions: React.Dispatch<React.SetStateAction<boolean>>;
  setIntroComplete: React.Dispatch<React.SetStateAction<boolean>>;
  processedIntroMessages: string[];
  setProcessedIntroMessages: React.Dispatch<React.SetStateAction<string[]>>;
  introComplete: boolean;
}

export const useIntroSequence = ({
  chatHistory,
  setChatHistory,
  introBubbles,
  setIsTyping,
  setShowOptions,
  setIntroComplete,
  processedIntroMessages,
  setProcessedIntroMessages,
  introComplete
}: UseIntroSequenceProps) => {
  // Add intro bubbles in sequence with proper timing and no duplicates
  useEffect(() => {
    if (chatHistory.length === 0 && !introComplete) {
      let delay = 0;
      const messageDelay = 2000; // 2 seconds between messages (increased from 1s)
      
      // Clear any existing messages first to prevent duplicates
      setChatHistory([]);
      setProcessedIntroMessages([]);
      
      introBubbles.forEach((bubble, index) => {
        // Skip if this message has already been processed to prevent duplicates
        if (processedIntroMessages.includes(bubble)) return;
        
        const messageId = `intro-${index}-${Date.now() + index}`; // Ensure unique IDs
        delay += messageDelay;
        
        setTimeout(() => {
          // Add to processed messages to prevent duplicates
          setProcessedIntroMessages(prev => [...prev, bubble]);
          
          setChatHistory(prev => {
            // Double check this exact message doesn't exist already
            if (prev.some(msg => msg.text === bubble)) return prev;
            return [...prev, { sender: 'bot', text: bubble, id: messageId }];
          });
          
          // After the last message is shown, show options and mark intro as complete
          if (index === introBubbles.length - 1) {
            setTimeout(() => {
              setShowOptions(true);
              setIntroComplete(true);
            }, 1000); // Wait 1s after last message before showing options
          }
        }, delay);
      });
      
      // Set typing indicators between messages with proper timing
      introBubbles.forEach((_, index) => {
        if (index < introBubbles.length) {
          const typingStartTime = index === 0 ? 0 : messageDelay * index;
          const typingEndTime = messageDelay * (index + 0.8);
          
          setTimeout(() => setIsTyping(true), typingStartTime);
          setTimeout(() => setIsTyping(false), typingEndTime);
        }
      });
    }
  }, [chatHistory.length, introBubbles, introComplete, processedIntroMessages]);
};
