
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConversationPanel from '@/components/analysis/ConversationPanel';
import InputPanel from '@/components/analysis/InputPanel';
import { 
  AnalysisResult, 
  BusinessCategory, 
  ApifyBusinessResult
} from "@/services/AnalysisService";
import { PlaceSelectionResult } from '@/hooks/useGooglePlaces';
import { Step } from '@/components/analysis/ConversationPanel';

interface AnalysisContentProps {
  step: Step;
  businessName: string;
  analysisResult: AnalysisResult | null;
  suggestedCategories: BusinessCategory[];
  primaryCategory?: string;
  location: string;
  apifyBusinessResult: ApifyBusinessResult | null;
  apifyLoading: boolean;
  setBusinessName: (name: string) => void;
  handleLocationSelect: (location: string, placeData?: PlaceSelectionResult) => void;
  handleBeginAnalysis: () => void;
  handleAnalysisComplete: () => void;
  handleChatComplete: () => void;
  handleStartOver: () => void;
}

const AnalysisContent: React.FC<AnalysisContentProps> = ({
  step,
  businessName,
  analysisResult,
  suggestedCategories,
  primaryCategory,
  location,
  apifyBusinessResult,
  apifyLoading,
  setBusinessName,
  handleLocationSelect,
  handleBeginAnalysis,
  handleAnalysisComplete,
  handleChatComplete,
  handleStartOver
}) => {
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  
  // Listen for panel state changes by monitoring DOM mutations for data attributes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-panel-visible') {
          const chatbotEl = document.querySelector('[data-panel-visible="true"]');
          if (chatbotEl) {
            setIsPanelCollapsed(true);
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
  
  // Reset panel state when step changes
  useEffect(() => {
    if (step !== 'chatbot') {
      setIsPanelCollapsed(false);
    }
  }, [step]);

  return (
    <motion.div 
      className="w-full max-w-7xl flex flex-col md:flex-row gap-8"
      layout
      transition={{ duration: 0.5, ease: [0.19, 1.0, 0.22, 1.0] }}
    >
      <ConversationPanel
        step={step}
        analysisResult={analysisResult}
        suggestedCategories={suggestedCategories}
        primaryCategory={primaryCategory}
        location={location}
        businessName={businessName}
        onBeginAnalysis={handleBeginAnalysis}
        onStartOver={handleStartOver}
        onAnalysisComplete={handleAnalysisComplete}
        onChatComplete={handleChatComplete}
        handleLocationSelect={handleLocationSelect}
      />
      
      <AnimatePresence>
        {(step === 'chatbot' && isPanelCollapsed) && (
          <motion.div 
            className="w-full md:w-[60%]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <InputPanel
              step={step}
              businessName={businessName}
              analysisResult={analysisResult}
              suggestedCategories={suggestedCategories}
              setBusinessName={setBusinessName}
              handleBusinessNameSubmit={() => {}}
              handleLocationSelect={handleLocationSelect}
              handleStartOver={handleStartOver}
              apifyBusinessResult={apifyBusinessResult}
              apifyLoading={apifyLoading}
            />
          </motion.div>
        )}
        
        {(!isPanelCollapsed || step !== 'chatbot') && (
          <InputPanel
            step={step}
            businessName={businessName}
            analysisResult={analysisResult}
            suggestedCategories={suggestedCategories}
            setBusinessName={setBusinessName}
            handleBusinessNameSubmit={() => {}}
            handleLocationSelect={handleLocationSelect}
            handleStartOver={handleStartOver}
            apifyBusinessResult={apifyBusinessResult}
            apifyLoading={apifyLoading}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AnalysisContent;
