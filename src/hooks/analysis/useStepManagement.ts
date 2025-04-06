
import { useState } from 'react';
import { Step } from "@/components/analysis/ConversationPanel";

interface UseStepManagementResult {
  step: Step;
  setStep: (step: Step) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  handleBeginAnalysis: () => void;
  handleStartOver: () => void;
  handleAnalysisComplete: () => void;
  handleChatComplete: () => void;
}

export const useStepManagement = (): UseStepManagementResult => {
  const [step, setStep] = useState<Step>('welcome');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleBeginAnalysis = () => {
    setStep('business-name');
  };
  
  const handleStartOver = () => {
    setStep('welcome');
    setIsLoading(false);
  };
  
  const handleAnalysisComplete = () => {
    setStep('chatbot');
  };
  
  const handleChatComplete = () => {
    // Instead of going to results, we stay in chatbot and show AI platform ratings
    setStep('chatbot');
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
