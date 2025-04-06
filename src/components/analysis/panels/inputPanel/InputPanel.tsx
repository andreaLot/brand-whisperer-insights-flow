
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalysisResult, BusinessCategory, ApifyBusinessResult } from "@/services/types";
import { PlaceSelectionResult } from '@/hooks/useGooglePlaces';
import { Step } from '../../ConversationPanel';
import { usePanelAnimations } from './usePanelAnimations';
import WelcomePanel from './WelcomePanel';
import CategoryDetectionPanel from './CategoryDetectionPanel';
import AnalyzingPanel from './AnalyzingPanel';
import ChatbotPanels from './ChatbotPanels';

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
  // Use our extracted animation hook
  const { animationProps, activePanels, handleChatbotMessage } = usePanelAnimations(step);
  
  // Listen for message changes in ChatbotStep
  useEffect(() => {
    window.addEventListener('message', handleChatbotMessage);
    return () => {
      window.removeEventListener('message', handleChatbotMessage);
    };
  }, [handleChatbotMessage]);

  return (
    <motion.div
      className="w-full"
      {...animationProps}
    >
      {/* Show appropriate panel based on current step */}
      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <WelcomePanel 
            handleLocationSelect={handleLocationSelect} 
            animationProps={animationProps}
          />
        )}
        
        {step === 'category-detection' && (
          <CategoryDetectionPanel 
            suggestedCategories={suggestedCategories}
            apifyLoading={apifyLoading}
            animationProps={animationProps}
          />
        )}
        
        {step === 'analyzing' && (
          <AnalyzingPanel animationProps={animationProps} />
        )}
        
        {step === 'chatbot' && (
          <ChatbotPanels 
            activePanels={activePanels} 
            analysisResult={analysisResult}
            apifyBusinessResult={apifyBusinessResult}
            animationProps={animationProps}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InputPanel;
