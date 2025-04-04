
import React from 'react';
import ConversationBubble from "@/components/ConversationBubble";
import AnalysisWelcome from './AnalysisWelcome';
import BusinessNameStep from './BusinessNameStep';
import CategoryDetectionStep from './CategoryDetectionStep';
import AnalyzingStep from './AnalyzingStep';
import ResultsStep from './ResultsStep';
import { BusinessCategory, AnalysisResult } from "@/services/AnalysisService";

type Step = 'welcome' | 'business-name' | 'category-detection' | 'analyzing' | 'results';

interface ConversationPanelProps {
  step: Step;
  analysisResult: AnalysisResult | null;
  suggestedCategories: BusinessCategory[];
  onBeginAnalysis: () => void;
  onStartOver: () => void;
  handleLocationSelect: (location: string) => void;
}

const ConversationPanel: React.FC<ConversationPanelProps> = ({
  step,
  analysisResult,
  suggestedCategories,
  onBeginAnalysis,
  onStartOver,
  handleLocationSelect
}) => {
  return (
    <div className="w-full md:w-1/2 flex flex-col gap-6">
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
