
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
  }, [step]);

  // Function to animate panel collapse
  const animatePanelTransition = () => {
    if (step === 'chatbot') {
      // When a selection is made in chatbot, transition the panel over 3 seconds
      const transitionDuration = 3000; // 3 seconds
      let startTime: number;
      
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / transitionDuration, 1);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsPanelCollapsed(true);
        }
      };
      
      requestAnimationFrame(animate);
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
