
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalysisResult, BusinessCategory } from "@/services/AnalysisService";
import AnalysisWelcome from './AnalysisWelcome';
import BusinessNameStep from './BusinessNameStep';
import CategoryDetectionStep from './CategoryDetectionStep';
import AnalyzingStep from './AnalyzingStep';
import ChatbotStep from './ChatbotStep';
import ResultsStep from './ResultsStep';
import ProgressIndicator from '@/components/ProgressIndicator';
import { PlaceSelectionResult } from '@/hooks/useGooglePlaces';
import { cn } from "@/lib/utils";

export type Step = 'welcome' | 'business-name' | 'category-detection' | 'analyzing' | 'chatbot' | 'results';

interface ConversationPanelProps {
  className?: string;
  step: Step;
  businessName: string;
  analysisResult: AnalysisResult | null;
  suggestedCategories: BusinessCategory[];
  primaryCategory?: string;
  location: string;
  onBeginAnalysis: () => void;
  onStartOver: () => void;
  onAnalysisComplete: () => void;
  onChatComplete: () => void;
  handleLocationSelect: (location: string, placeData?: PlaceSelectionResult) => void;
}

const ConversationPanel: React.FC<ConversationPanelProps> = ({
  className,
  step,
  businessName,
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
  // Define step to index mapping for progress indicator
  const stepToIndex = {
    'welcome': 0,
    'business-name': 1,
    'category-detection': 2,
    'analyzing': 3,
    'chatbot': 4,
    'results': 5
  };
  
  const [currentStepIndex, setCurrentStepIndex] = useState(stepToIndex[step]);
  
  // Update current step index when step changes
  useEffect(() => {
    setCurrentStepIndex(stepToIndex[step]);
  }, [step]);
  
  return (
    <div className={cn("bg-brand-black-light rounded-lg p-6 flex flex-col", className)}>
      <ProgressIndicator 
        currentStep={currentStepIndex} 
        totalSteps={Object.keys(stepToIndex).length} 
      />
      
      <div className="h-[500px] flex flex-col">
        <AnimatePresence mode="wait">
          {step === 'welcome' && (
            <motion.div 
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full"
            >
              <AnalysisWelcome onBeginAnalysis={onBeginAnalysis} />
            </motion.div>
          )}
          
          {step === 'business-name' && (
            <motion.div 
              key="business-name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full"
            >
              <BusinessNameStep handleLocationSelect={handleLocationSelect} />
            </motion.div>
          )}
          
          {step === 'category-detection' && (
            <motion.div 
              key="category-detection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full"
            >
              <CategoryDetectionStep 
                businessName={businessName} 
                suggestedCategories={suggestedCategories} 
              />
            </motion.div>
          )}
          
          {step === 'analyzing' && (
            <motion.div 
              key="analyzing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full"
            >
              <AnalyzingStep 
                businessName={businessName}
                primaryCategory={primaryCategory}
                location={location}
                onAnalysisComplete={onAnalysisComplete}
              />
            </motion.div>
          )}
          
          {step === 'chatbot' && (
            <motion.div 
              key="chatbot"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full"
            >
              <ChatbotStep 
                businessName={businessName}
                location={location}
                onChatComplete={onChatComplete}
              />
            </motion.div>
          )}
          
          {step === 'results' && analysisResult && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full overflow-y-auto"
            >
              <ResultsStep 
                analysisResult={analysisResult}
                businessName={businessName}
                onStartOver={onStartOver}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ConversationPanel;
