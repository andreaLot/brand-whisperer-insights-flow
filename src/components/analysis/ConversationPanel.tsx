
import React from 'react';
import ConversationBubble from "@/components/ConversationBubble";
import AnalysisWelcome from './AnalysisWelcome';
import BusinessNameStep from './BusinessNameStep';
import CategoryDetectionStep from './CategoryDetectionStep';
import AnalyzingStep from './AnalyzingStep';
import ResultsStep from './ResultsStep';
import ChatbotStep from './ChatbotStep';
import { BusinessCategory, AnalysisResult } from "@/services/AnalysisService";
import { PlaceSelectionResult } from '@/hooks/useGooglePlaces';
import { AnimatePresence } from 'framer-motion';

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
  return (
    <div className="w-full md:w-[35%] flex flex-col gap-6">
      <ConversationBubble>
        <AnimatePresence mode="wait">
          {step === 'welcome' && (
            <AnalysisWelcome onBeginAnalysis={onBeginAnalysis} />
          )}
          
          {step === 'business-name' && (
            <BusinessNameStep handleLocationSelect={handleLocationSelect} />
          )}
          
          {/* We'll keep this component in the codebase but we won't show it anymore */}
          {/*
          {step === 'category-detection' && (
            <CategoryDetectionStep suggestedCategories={suggestedCategories} />
          )}
          */}
          
          {/* Skip directly to analyzing step from business name */}
          {(step === 'analyzing' || step === 'category-detection') && (
            <AnalyzingStep 
              primaryCategory={primaryCategory} 
              location={location} 
              onAnalysisComplete={onAnalysisComplete}
            />
          )}
          
          {/* This will be shown after analysis is complete */}
          {step === 'chatbot' && (
            <ChatbotStep 
              primaryCategory={primaryCategory}
              location={location}
              businessName={businessName}
              onChatComplete={onChatComplete}
            />
          )}
          
          {step === 'results' && analysisResult && (
            <ResultsStep analysisResult={analysisResult} onStartOver={onStartOver} />
          )}
        </AnimatePresence>
      </ConversationBubble>
    </div>
  );
};

export default ConversationPanel;
