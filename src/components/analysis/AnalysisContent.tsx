
import React from 'react';
import { motion } from 'framer-motion';
import ConversationPanel from '@/components/analysis/ConversationPanel';
import InputPanel from '@/components/analysis/InputPanel';
import { 
  AnalysisResult, 
  BusinessCategory, 
  ApifyBusinessResult, 
  ApifyCategoryResult 
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
  apifyCategoryResults: ApifyCategoryResult[];
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
  apifyCategoryResults,
  apifyLoading,
  setBusinessName,
  handleLocationSelect,
  handleBeginAnalysis,
  handleAnalysisComplete,
  handleChatComplete,
  handleStartOver
}) => {
  // Determine layout ratio based on step
  const isInitialStep = step === 'welcome' || step === 'business-name';
  
  return (
    <motion.div 
      className="w-full max-w-7xl flex flex-col md:flex-row gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ConversationPanel
        className={`${isInitialStep ? 'md:w-1/2' : 'md:w-2/5'} transition-all duration-700 ease-in-out`}
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
        className={`${isInitialStep ? 'md:w-1/2' : 'md:w-3/5'} transition-all duration-700 ease-in-out`}
        step={step}
        businessName={businessName}
        analysisResult={analysisResult}
        suggestedCategories={suggestedCategories}
        setBusinessName={setBusinessName}
        handleBusinessNameSubmit={() => {}}
        handleLocationSelect={handleLocationSelect}
        handleStartOver={handleStartOver}
        apifyBusinessResult={apifyBusinessResult}
        apifyCategoryResults={apifyCategoryResults}
        apifyLoading={apifyLoading}
      />
    </motion.div>
  );
};

export default AnalysisContent;
