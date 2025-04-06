
import { useState, useEffect } from 'react';
import { Step } from '@/components/analysis/ConversationPanel';

interface PanelCollapseOptions {
  step: Step;
  initialCollapsed?: boolean;
}

interface PanelCollapseResult {
  isPanelCollapsed: boolean;
  setIsPanelCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  animatePanelTransition: () => void;
}

export const usePanelCollapse = ({ step, initialCollapsed = false }: PanelCollapseOptions): PanelCollapseResult => {
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(initialCollapsed);

  // Reset panel state when step changes
  useEffect(() => {
    if (step !== 'chatbot') {
      setIsPanelCollapsed(false);
    }
    
    // Don't auto-collapse panel when in chatbot step anymore
  }, [step]);

  // Function to animate panel collapse
  const animatePanelTransition = () => {
    if (step === 'chatbot') {
      // Only set collapsed to true when explicitly called
      setIsPanelCollapsed(true);
    }
  };
  
  // Listen for panel state changes by monitoring DOM mutations for data attributes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-panel-visible') {
          const chatbotEl = document.querySelector('[data-panel-visible="true"]');
          if (chatbotEl && step === 'chatbot') {
            animatePanelTransition();
          }
        }
      });
    });
    
    // Start observing once we reach chatbot step
    if (step === 'chatbot') {
      const chatbotContainer = document.querySelector('.chatbot-step-container');
      if (chatbotContainer) {
        observer.observe(chatbotContainer, { attributes: true, subtree: true });
      }
      
      // Also observe the document body for the hidden input that tracks panel visibility
      observer.observe(document.body, { attributes: true, subtree: true });
    }
    
    return () => {
      observer.disconnect();
    };
  }, [step]);

  return {
    isPanelCollapsed,
    setIsPanelCollapsed,
    animatePanelTransition
  };
};
