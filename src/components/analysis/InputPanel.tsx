
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedInputContent from './panels/inputPanel/AnimatedInputContent';
import CategoryDetectionPanel from './panels/CategoryDetectionPanel';
import AnalyzingVideoPanel from './panels/AnalyzingVideoPanel';
import ChatbotContent from './panels/chatbot/ChatbotContent';
import { AnalysisResult, BusinessCategory, ApifyBusinessResult } from "@/services/AnalysisService";
import { Step } from './ConversationPanel';

interface InputPanelProps {
  step: Step;
  businessName: string;
  analysisResult: AnalysisResult | null;
  suggestedCategories: BusinessCategory[];
  apifyBusinessResult: ApifyBusinessResult | null;
  apifyLoading: boolean;
  setBusinessName: (name: string) => void;
  handleBusinessNameSubmit: () => void;
  handleLocationSelect: (location: string, address?: any) => void;
  handleStartOver: () => void;
}

const InputPanel: React.FC<InputPanelProps> = ({
  step,
  analysisResult,
  suggestedCategories,
  apifyBusinessResult,
  apifyLoading,
  ...props
}) => {
  const [visibleSnippet, setVisibleSnippet] = useState<'none' | 'competitors' | 'seo' | 'content' | 'ratings' | 'profile'>('none');
  
  // Set up listener for postMessage from chatbot
  useEffect(() => {
    const handleChatbotSelection = (event: MessageEvent) => {
      if (event.data && event.data.type === 'chatbot-selection') {
        const message = event.data.message;
        if (['ratings', 'competitors', 'seo', 'content', 'profile'].includes(message)) {
          setVisibleSnippet(message as any);
        }
      }
    };
    
    window.addEventListener('message', handleChatbotSelection);
    
    return () => {
      window.removeEventListener('message', handleChatbotSelection);
    };
  }, []);
  
  if (step === 'welcome') {
    return (
      <motion.div 
        className="h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <AnimatedInputContent>
          {/* Placeholder content */}
          <div className="p-4">Welcome content goes here</div>
        </AnimatedInputContent>
      </motion.div>
    );
  }

  if (step === 'business-name') {
    return (
      <motion.div 
        className="h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <AnimatedInputContent>
          {/* Placeholder content */}
          <div className="p-4">Business name input content goes here</div>
        </AnimatedInputContent>
      </motion.div>
    );
  }

  if (step === 'category-detection') {
    return (
      <motion.div 
        className="h-full flex flex-col justify-center items-center py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="w-full max-w-lg">
          <CategoryDetectionPanel 
            suggestedCategories={suggestedCategories}
            apifyLoading={apifyLoading}
          />
        </div>
      </motion.div>
    );
  }
  
  if (step === 'analyzing') {
    return (
      <motion.div 
        className="h-full flex flex-col justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <AnalyzingVideoPanel />
      </motion.div>
    );
  }
  
  if (step === 'chatbot') {
    return (
      <motion.div 
        className="h-full p-4 bg-brand-black/30 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <ChatbotContent 
          visibleSnippet={visibleSnippet} 
          analysisResult={analysisResult}
          apifyBusinessResult={apifyBusinessResult}
        />
      </motion.div>
    );
  }
  
  return null;
};

export default InputPanel;
