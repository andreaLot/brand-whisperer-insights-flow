
import React, { useState, useEffect } from 'react';
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
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [panelSplitRatio, setPanelSplitRatio] = useState({
    conversation: '50%',
    input: '50%'
  });
  
  // Handle split ratio based on current step
  useEffect(() => {
    const updatePanelRatio = () => {
      if (step === 'welcome') {
        // Initial 50/50 split
        setPanelSplitRatio({
          conversation: '50%',
          input: '50%'
        });
      } else if (step === 'business-name' || step === 'category-detection' || step === 'analyzing') {
        // Transition to 40/60 split over 2 seconds
        const transitionDuration = 2000; // 2 seconds
        let startTime: number;
        
        const animate = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / transitionDuration, 1);
          
          // Interpolate from 50/50 to 40/60
          const convWidth = 50 - (10 * progress); // 50% to 40%
          const inputWidth = 50 + (10 * progress); // 50% to 60%
          
          setPanelSplitRatio({
            conversation: `${convWidth}%`,
            input: `${inputWidth}%`
          });
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        requestAnimationFrame(animate);
      } else if (step === 'chatbot') {
        if (isPanelCollapsed) {
          // After selection, transition to 40/60
          setPanelSplitRatio({
            conversation: '40%',
            input: '60%'
          });
        } else {
          // Initially full width for chatbot
          setPanelSplitRatio({
            conversation: '100%',
            input: '0%'
          });
        }
      }
    };
    
    updatePanelRatio();
  }, [step, isPanelCollapsed]);
  
  // Listen for panel state changes by monitoring DOM mutations for data attributes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-panel-visible') {
          const chatbotEl = document.querySelector('[data-panel-visible="true"]');
          if (chatbotEl && step === 'chatbot') {
            // When a selection is made in chatbot, transition the panel over 3 seconds
            const transitionDuration = 3000; // 3 seconds
            let startTime: number;
            
            const animate = (timestamp: number) => {
              if (!startTime) startTime = timestamp;
              const elapsed = timestamp - startTime;
              const progress = Math.min(elapsed / transitionDuration, 1);
              
              // Interpolate from 100/0 to 40/60
              const convWidth = 100 - (60 * progress); // 100% to 40%
              const inputWidth = 0 + (60 * progress); // 0% to 60%
              
              setPanelSplitRatio({
                conversation: `${convWidth}%`,
                input: `${inputWidth}%`
              });
              
              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setIsPanelCollapsed(true);
              }
            };
            
            requestAnimationFrame(animate);
          }
        }
      });
    });
    
    // Start observing once we reach chatbot step
    if (step === 'chatbot') {
      const chatbotContainer = document.querySelector('.chatbot-step-container');
      if (chatbotContainer) {
        observer.observe(chatbotContainer, { attributes: true, subtree: true });
      }
    }
    
    return () => {
      observer.disconnect();
    };
  }, [step]);
  
  // Reset panel state when step changes
  useEffect(() => {
    if (step !== 'chatbot') {
      setIsPanelCollapsed(false);
    }
  }, [step]);

  return (
    <motion.div 
      className="w-full max-w-7xl flex flex-col md:flex-row gap-8"
      layout
      transition={{ duration: 0.5, ease: [0.19, 1.0, 0.22, 1.0] }}
    >
      <motion.div 
        className="flex flex-col gap-6"
        style={{ width: panelSplitRatio.conversation }}
        transition={{ duration: 0.8, ease: [0.19, 1.0, 0.22, 1.0] }}
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
      
      <AnimatePresence>
        {(step === 'chatbot' && isPanelCollapsed) && (
          <motion.div 
            style={{ width: panelSplitRatio.input }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
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
              apifyLoading={apifyLoading}
            />
          </motion.div>
        )}
        
        {(!isPanelCollapsed || step !== 'chatbot') && step !== 'chatbot' && (
          <motion.div
            style={{ width: panelSplitRatio.input }}
            transition={{ duration: 0.8, ease: [0.19, 1.0, 0.22, 1.0] }}
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
              apifyLoading={apifyLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AnalysisContent;
