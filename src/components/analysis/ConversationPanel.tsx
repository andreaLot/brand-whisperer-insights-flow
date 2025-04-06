
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConversationBubble from "@/components/ConversationBubble";
import AnalysisWelcome from './AnalysisWelcome';
import BusinessNameStep from './BusinessNameStep';
import AnalyzingStep from './AnalyzingStep';
import ResultsStep from './ResultsStep';
import ChatbotStep from './ChatbotStep';
import { BusinessCategory, AnalysisResult } from "@/services/AnalysisService";
import { PlaceSelectionResult } from '@/hooks/useGooglePlaces';

export type Step = 'welcome' | 'business-name' | 'category-detection' | 'analyzing' | 'chatbot' | 'results';

interface ConversationPanelProps {
  step: Step;
  analysisResult: AnalysisResult | null;
  suggestedCategories: BusinessCategory[];
  primaryCategory?: string;
  location?: string;
  onBeginAnalysis: () => void;
  onStartOver: () => void;
  onAnalysisComplete: () => void;
  onChatComplete: () => void;
  handleLocationSelect: (location: string, placeData?: PlaceSelectionResult, apifyResult?: any) => void;
  businessName: string;
}

const ConversationPanel: React.FC<ConversationPanelProps> = ({
  step,
  analysisResult,
  suggestedCategories,
  primaryCategory,
  location,
  onBeginAnalysis,
  onStartOver,
  onAnalysisComplete,
  onChatComplete,
  handleLocationSelect,
  businessName
}) => {
  const [isPanelExpanded, setIsPanelExpanded] = useState(true);
  
  // Watch for chatbot interactions to collapse panel
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-panel-visible') {
          const chatbotEl = document.querySelector('[data-panel-visible="true"]');
          if (chatbotEl) {
            setIsPanelExpanded(false);
          }
        }
      });
    });
    
    const chatbotStep = document.querySelector('.chatbot-step-container');
    if (chatbotStep) {
      observer.observe(chatbotStep, { attributes: true, subtree: true });
    }
    
    return () => {
      observer.disconnect();
    };
  }, [step]);
  
  // Reset panel expansion when step changes
  useEffect(() => {
    if (step !== 'chatbot') {
      setIsPanelExpanded(true);
    }
  }, [step]);

  // Panel animation variants
  const panelVariants = {
    expanded: { width: '100%' },
    collapsed: { width: '40%' }
  };

  return (
    <motion.div 
      className="flex flex-col gap-6"
      variants={panelVariants}
      animate={isPanelExpanded || step !== 'chatbot' ? 'expanded' : 'collapsed'}
      transition={{ duration: 0.8, ease: [0.19, 1.0, 0.22, 1.0] }} // Ease animation for elegance
    >
      <ConversationBubble>
        <AnimatePresence mode="wait">
          {step === 'welcome' && (
            <AnalysisWelcome onBeginAnalysis={onBeginAnalysis} />
          )}
          
          {step === 'business-name' && (
            <BusinessNameStep handleLocationSelect={handleLocationSelect} />
          )}
          
          {(step === 'analyzing' || step === 'category-detection') && (
            <AnalyzingStep 
              primaryCategory={primaryCategory} 
              location={location} 
              onAnalysisComplete={onAnalysisComplete}
            />
          )}
          
          {step === 'chatbot' && (
            <div className="chatbot-step-container">
              <ChatbotStep 
                primaryCategory={primaryCategory}
                location={location}
                businessName={businessName}
                onChatComplete={onChatComplete}
              />
            </div>
          )}
          
          {step === 'results' && analysisResult && (
            <ResultsStep analysisResult={analysisResult} onStartOver={onStartOver} />
          )}
        </AnimatePresence>
      </ConversationBubble>
    </motion.div>
  );
};

export default ConversationPanel;
