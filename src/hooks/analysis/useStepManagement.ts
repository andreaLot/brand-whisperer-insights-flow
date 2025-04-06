
import { useState } from 'react';
import { Step } from '@/components/analysis/ConversationPanel';

export const useStepManagement = () => {
  const [step, setStep] = useState<Step>('welcome');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleBeginAnalysis = () => {
    setStep('business-name');
  };

  const handleStartOver = () => {
    setStep('welcome');
  };

  const handleAnalysisComplete = () => {
    setStep('chatbot');
  };

  const handleChatComplete = () => {
    setStep('results');
  };

  return {
    step,
    setStep,
    isLoading,
    setIsLoading,
    handleBeginAnalysis,
    handleStartOver,
    handleAnalysisComplete,
    handleChatComplete
  };
};
