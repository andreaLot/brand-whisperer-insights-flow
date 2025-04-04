
import React from 'react';
import ConversationBubble from "@/components/ConversationBubble";
import AnalysisWelcome from './AnalysisWelcome';
import BusinessNameStep from './BusinessNameStep';
import CategoryDetectionStep from './CategoryDetectionStep';
import AnalyzingStep from './AnalyzingStep';
import ResultsStep from './ResultsStep';
import ChatbotStep from './ChatbotStep';
import { BusinessCategory, AnalysisResult } from "@/services/AnalysisService";

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
  handleLocationSelect: (location: string) => void;
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
  handleLocationSelect
}) => {
  return (
    <div className="w-full md:w-[35%] flex flex-col gap-6">
      <ConversationBubble>
        {step === 'welcome' && (
          <AnalysisWelcome onBeginAnalysis={onBeginAnalysis} />
        )}
        
        {step === 'business-name' && (
          <BusinessNameStep handleLocationSelect={handleLocationSelect} />
        )}
        
        {step === 'category-detection' && (
          <CategoryDetectionStep suggestedCategories={suggestedCategories} />
        )}
        
        {/* Modified to allow for continuous flow without abrupt transitions */}
        {step === 'analyzing' && (
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
            onChatComplete={onChatComplete}
          />
        )}
        
        {step === 'results' && analysisResult && (
          <ResultsStep analysisResult={analysisResult} onStartOver={onStartOver} />
        )}
      </ConversationBubble>
    </div>
  );
};

export default ConversationPanel;
