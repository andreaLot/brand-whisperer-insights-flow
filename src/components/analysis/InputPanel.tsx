
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ResultsStep from './ResultsStep';
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
  // Track which snippet is being shown during chatbot interaction
  const [visibleSnippet, setVisibleSnippet] = useState<'none' | 'competitors' | 'seo' | 'content'>('none');
  
  // Listen for message changes in ChatbotStep
  useEffect(() => {
    const handleChatbotMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'chatbot-selection') {
        if (event.data.message.includes('competitors')) {
          setVisibleSnippet('competitors');
        } else if (event.data.message.includes('SEO')) {
          setVisibleSnippet('seo');
        } else if (event.data.message.includes('Content')) {
          setVisibleSnippet('content');
        }
      }
    };
    
    window.addEventListener('message', handleChatbotMessage);
    return () => {
      window.removeEventListener('message', handleChatbotMessage);
    };
  }, []);

  // Monitor step changes and reset snippet visibility when appropriate
  useEffect(() => {
    if (step !== 'chatbot') {
      setVisibleSnippet('none');
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
        
        {/* Chatbot-triggered content snippets */}
        {step === 'chatbot' && (
          <motion.div
            key="chatbot"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4"
          >
            <ChatbotContent 
              visibleSnippet={visibleSnippet}
              analysisResult={analysisResult}
              apifyBusinessResult={apifyBusinessResult}
            />
          </motion.div>
        )}
        
        {step === 'results' && analysisResult && (
          <motion.div
            key="results"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ResultsStep
              analysisResult={analysisResult}
              onStartOver={handleStartOver}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InputPanel;
