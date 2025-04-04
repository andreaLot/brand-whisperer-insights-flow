
import React, { useEffect, useState } from 'react';
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
  // Determine if we're past the initial welcome or business name steps
  const isAnalysisStarted = !['welcome', 'business-name'].includes(step);
  
  // Calculate the width for the left panel (conversation)
  const leftPanelWidth = isAnalysisStarted ? '40%' : '50%';
  
  // Calculate the width for the right panel (input/results)
  const rightPanelWidth = isAnalysisStarted ? '60%' : '50%';
  
  return (
    <div className="w-full max-w-7xl flex flex-col md:flex-row gap-8">
      <motion.div 
        className="w-full"
        animate={{ width: leftPanelWidth }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
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
      </motion.div>
      
      <motion.div 
        className="w-full"
        animate={{ width: rightPanelWidth }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
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
          apifyCategoryResults={apifyCategoryResults}
          apifyLoading={apifyLoading}
        />
      </motion.div>
    </div>
  );
};

export default AnalysisContent;
