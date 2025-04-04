
import React from 'react';
import ConversationBubble from "@/components/ConversationBubble";
import AnalysisWelcome from './AnalysisWelcome';
import BusinessNameStep from './BusinessNameStep';
import LocationStep from './LocationStep';
import CategoryDetectionStep from './CategoryDetectionStep';
import AnalyzingStep from './AnalyzingStep';
import ResultsStep from './ResultsStep';
import { BusinessCategory, AnalysisResult } from "@/services/AnalysisService";

type Step = 'welcome' | 'business-name' | 'location' | 'category-detection' | 'analyzing' | 'results';

interface ConversationPanelProps {
  step: Step;
  analysisResult: AnalysisResult | null;
  suggestedCategories: BusinessCategory[];
  onBeginAnalysis: () => void;
  onStartOver: () => void;
}

const ConversationPanel: React.FC<ConversationPanelProps> = ({
  step,
  analysisResult,
  suggestedCategories,
  onBeginAnalysis,
  onStartOver
}) => {
  return (
    <div className="w-full md:w-1/2 flex flex-col gap-6">
      <ConversationBubble>
        {step === 'welcome' && (
          <AnalysisWelcome onBeginAnalysis={onBeginAnalysis} />
        )}
        
        {step === 'business-name' && (
          <BusinessNameStep />
        )}
        
        {step === 'location' && (
          <LocationStep />
        )}
        
        {step === 'category-detection' && (
          <CategoryDetectionStep suggestedCategories={suggestedCategories} />
        )}
        
        {step === 'analyzing' && (
          <AnalyzingStep />
        )}
        
        {step === 'results' && analysisResult && (
          <ResultsStep analysisResult={analysisResult} onStartOver={onStartOver} />
        )}
      </ConversationBubble>
    </div>
  );
};

export default ConversationPanel;
