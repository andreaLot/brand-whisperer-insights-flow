
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalysisResult, BusinessCategory, ApifyBusinessResult } from "@/services/AnalysisService";
import { PlaceSelectionResult } from '@/hooks/useGooglePlaces';
import { Step } from './ConversationPanel';
import LocationPanel from './panels/LocationPanel';
import CategoryDetectionPanel from './panels/CategoryDetectionPanel';
import AnalyzingVideoPanel from './panels/AnalyzingVideoPanel';
import ChatbotContent from './panels/chatbot/ChatbotContent';

interface InputPanelProps {
  step: Step;
  businessName: string;
  analysisResult: AnalysisResult | null;
  suggestedCategories: BusinessCategory[];
  setBusinessName: (name: string) => void;
  handleBusinessNameSubmit: () => void;
  handleLocationSelect: (location: string, placeData?: PlaceSelectionResult) => void;
  handleStartOver: () => void;
  apifyBusinessResult?: ApifyBusinessResult | null;
  apifyLoading?: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({
  step,
  businessName,
  analysisResult,
  suggestedCategories,
  setBusinessName,
  handleBusinessNameSubmit,
  handleLocationSelect,
  handleStartOver,
  apifyBusinessResult,
  apifyLoading = false
}) => {
  // Track active panels instead of just one
  const [activePanels, setActivePanels] = useState<Array<'none' | 'competitors' | 'seo' | 'content' | 'ratings' | 'google-basics'>>(['none']);
  
  // Listen for message changes in ChatbotStep
  useEffect(() => {
    const handleChatbotMessage = (event: MessageEvent) => {
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
    };
    
    window.addEventListener('message', handleChatbotMessage);
    return () => {
      window.removeEventListener('message', handleChatbotMessage);
    };
  }, []);

  // Reset active panels when step changes
  useEffect(() => {
    if (step !== 'chatbot') {
      setActivePanels(['none']);
    }
  }, [step]);

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

  return (
    <motion.div
      className="w-full"
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Show location selector in the welcome step */}
      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <LocationPanel handleLocationSelect={handleLocationSelect} />
          </motion.div>
        )}
        
        {step === 'category-detection' && (
          <motion.div
            key="category"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <CategoryDetectionPanel 
              suggestedCategories={suggestedCategories}
              apifyLoading={apifyLoading}
            />
          </motion.div>
        )}
        
        {/* Show video during analyzing step with higher z-index */}
        {step === 'analyzing' && (
          <motion.div
            key="analyzing"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10"
          >
            <AnalyzingVideoPanel />
          </motion.div>
        )}
        
        {/* Chatbot-triggered content snippets - always show in chatbot step */}
        {step === 'chatbot' && (
          <motion.div
            key="chatbot"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            {/* Show all active panels in order */}
            {activePanels.includes('ratings') && (
              <ChatbotContent 
                visibleSnippet="ratings"
                analysisResult={analysisResult}
                apifyBusinessResult={apifyBusinessResult}
              />
            )}
            
            {activePanels.includes('google-basics') && (
              <ChatbotContent 
                visibleSnippet="google-basics"
                analysisResult={analysisResult}
                apifyBusinessResult={apifyBusinessResult}
              />
            )}
            
            {activePanels.includes('competitors') && (
              <ChatbotContent 
                visibleSnippet="competitors"
                analysisResult={analysisResult}
                apifyBusinessResult={apifyBusinessResult}
              />
            )}
            
            {activePanels.includes('seo') && (
              <ChatbotContent 
                visibleSnippet="seo"
                analysisResult={analysisResult}
                apifyBusinessResult={apifyBusinessResult}
              />
            )}
            
            {activePanels.includes('content') && (
              <ChatbotContent 
                visibleSnippet="content"
                analysisResult={analysisResult}
                apifyBusinessResult={apifyBusinessResult}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InputPanel;
