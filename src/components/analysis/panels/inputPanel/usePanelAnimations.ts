
import { useState, useCallback, useEffect } from 'react';
import { Step } from '../../ConversationPanel';

type PanelType = 'none' | 'competitors' | 'seo' | 'content' | 'ratings' | 'google-basics';

export const usePanelAnimations = (step: Step) => {
  // Track active panels
  const [activePanels, setActivePanels] = useState<Array<PanelType>>(['none']);
  
  // Animation variants
  const panelVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: [0.19, 1.0, 0.22, 1.0] }
    },
    exit: { 
      opacity: 0, 
      x: 20, 
      transition: { duration: 0.3 }
    }
  };
  
  // Animation properties to pass to motion components
  const animationProps = {
    variants: panelVariants,
    initial: "hidden",
    animate: "visible",
    exit: "exit"
  };
  
  // Handler for chatbot messages
  const handleChatbotMessage = useCallback((event: MessageEvent) => {
    if (event.data && event.data.type === 'chatbot-selection') {
      console.log("Received message event:", event.data);
      
      if (event.data.message.includes('ratings')) {
        console.log("Setting ratings panel to visible");
        setActivePanels(prev => {
          if (!prev.includes('ratings')) {
            return [...prev, 'ratings'];
          }
          return prev;
        });
      } 
      else if (event.data.message.includes('google-basics')) {
        console.log("Setting google-basics panel to visible");
        setActivePanels(prev => {
          if (!prev.includes('google-basics')) {
            return [...prev, 'google-basics'];
          }
          return prev;
        });
      }
      else if (event.data.message.includes('competitors')) {
        setActivePanels(prev => {
          if (!prev.includes('competitors')) {
            return [...prev, 'competitors'];
          }
          return prev;
        });
      }
      else if (event.data.message.includes('SEO')) {
        setActivePanels(prev => {
          if (!prev.includes('seo')) {
            return [...prev, 'seo'];
          }
          return prev;
        });
      }
      else if (event.data.message.includes('content')) {
        setActivePanels(prev => {
          if (!prev.includes('content')) {
            return [...prev, 'content'];
          }
          return prev;
        });
      }
    }
  }, []);
  
  // Reset active panels when step changes - using useEffect to prevent infinite renders
  useEffect(() => {
    if (step !== 'chatbot') {
      setActivePanels(['none']);
    }
  }, [step]);
  
  return { animationProps, activePanels, handleChatbotMessage };
};
