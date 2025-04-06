
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConversationPanel from '@/components/analysis/ConversationPanel';
import InputPanel from '@/components/analysis/InputPanel';
import { 
  AnalysisResult, 
  BusinessCategory, 
  ApifyBusinessResult
} from "@/services/AnalysisService";
import { PlaceSelectionResult } from '@/hooks/useGooglePlaces';
import { Step } from '@/components/analysis/ConversationPanel';
import { usePanelSplit } from '@/components/analysis/hooks/usePanelSplit';
import { usePanelCollapse } from '@/components/analysis/hooks/usePanelCollapse';
import PanelContainer from '@/components/analysis/panels/panelLayout/PanelContainer';
import AnimatedInputContent from '@/components/analysis/panels/inputPanel/AnimatedInputContent';

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
  // Use custom hooks for panel state management
  const { isPanelCollapsed, setIsPanelCollapsed } = usePanelCollapse({ step });
  const panelSplitRatio = usePanelSplit(step, isPanelCollapsed);
  
  // Force the input panel to be visible when in chatbot step
  const forceShowInputPanel = step === 'chatbot';
  
  return (
    <motion.div 
      className="w-full max-w-7xl flex flex-col md:flex-row gap-8"
      layout
      transition={{ duration: 0.5, ease: [0.19, 1.0, 0.22, 1.0] }}
    >
      {/* Conversation Panel */}
      <PanelContainer width={panelSplitRatio.conversation}>
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
      </PanelContainer>
      
      {/* Input Panel - always show for chatbot step */}
      <AnimatePresence>
        {/* Always show input panel for chatbot step */}
        {forceShowInputPanel && (
          <PanelContainer width={panelSplitRatio.input}>
            <AnimatedInputContent>
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
            </AnimatedInputContent>
          </PanelContainer>
        )}
        
        {/* Show input panel for non-chatbot steps */}
        {!forceShowInputPanel && (
          <PanelContainer width={panelSplitRatio.input}>
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
          </PanelContainer>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AnalysisContent;
