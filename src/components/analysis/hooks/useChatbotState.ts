
import { useState, useEffect } from 'react';

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  id: string;
}

interface UseChatbotStateProps {
  businessName: string;
}

export const useChatbotState = ({ businessName }: UseChatbotStateProps) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isFinalPhase, setIsFinalPhase] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [processedIntroMessages, setProcessedIntroMessages] = useState<string[]>([]);

  const introBubbles = [
    `Hello! I've just finished analyzing "${businessName}", I can help you understand how your business appears across different AI platforms.`,
    "Would you like to see your current ratings from top AI assistants?",
  ];

  // Reset state (useful for component re-renders)
  const resetState = () => {
    setChatHistory([]);
    setProcessedIntroMessages([]);
    setIntroComplete(false);
    setIsFinalPhase(false);
    setIsTyping(false);
    setShowOptions(false);
    setIsPanelVisible(false);
  };

  return {
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
    introBubbles,
    resetState
  };
};
