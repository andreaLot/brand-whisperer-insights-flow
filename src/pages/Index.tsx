
import React from 'react';
import { useAnalysisState } from '@/hooks/useAnalysisState';
import AnalysisContent from '@/components/analysis/AnalysisContent';
import AnalysisFooter from '@/components/analysis/AnalysisFooter';

const Index = () => {
  const analysisState = useAnalysisState();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-black p-4 text-white">
      <AnalysisContent 
        step={analysisState.step}
        businessName={analysisState.businessName}
        analysisResult={analysisState.analysisResult}
        suggestedCategories={analysisState.suggestedCategories}
        primaryCategory={analysisState.primaryCategory}
        location={analysisState.location}
        apifyBusinessResult={analysisState.apifyBusinessResult}
        apifyLoading={analysisState.apifyLoading}
        setBusinessName={analysisState.setBusinessName}
        handleLocationSelect={analysisState.handleLocationSelect}
        handleBeginAnalysis={analysisState.handleBeginAnalysis}
        handleAnalysisComplete={analysisState.handleAnalysisComplete}
        handleChatComplete={analysisState.handleChatComplete}
        handleStartOver={analysisState.handleStartOver}
      />
      
      <AnalysisFooter />
    </div>
  );
};

export default Index;
