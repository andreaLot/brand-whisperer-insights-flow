
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConversationBubble from "@/components/ConversationBubble";
import AnalysisWelcome from './AnalysisWelcome';
import BusinessNameStep from './BusinessNameStep';
import AnalyzingStep from './AnalyzingStep';
import ChatbotStep from './ChatbotStep';
import { BusinessCategory, AnalysisResult } from "@/services/AnalysisService";
import { PlaceSelectionResult } from '@/hooks/useGooglePlaces';

export type Step = 'welcome' | 'business-name' | 'category-detection' | 'analyzing' | 'chatbot';

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
  return (
    <motion.div 
      className="flex flex-col gap-6 w-full"
      layout
      transition={{ duration: 0.8, ease: [0.19, 1.0, 0.22, 1.0] }}
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
        </AnimatePresence>
      </ConversationBubble>
    </motion.div>
  );
};

export default ConversationPanel;
