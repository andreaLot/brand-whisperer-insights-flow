
import React from 'react';
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
  return (
    <div className="w-full max-w-7xl flex flex-col md:flex-row gap-8">
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
    </div>
  );
};

export default AnalysisContent;
