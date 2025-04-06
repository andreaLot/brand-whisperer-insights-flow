import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedInputContent from './panels/inputPanel/AnimatedInputContent';
import CategoryDetectionPanel from './panels/CategoryDetectionPanel';
import AnalyzingVideoPanel from './panels/AnalyzingVideoPanel';
import ChatbotContent from './panels/chatbot/ChatbotContent';
import SearchInput from '@/components/SearchInput';
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
  businessName,
  analysisResult,
  suggestedCategories,
  apifyBusinessResult,
  apifyLoading,
  setBusinessName,
  handleBusinessNameSubmit,
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
          {/* Welcome content */}
          <div className="p-4 h-full flex items-center justify-center">
            <h3 className="text-xl text-center text-gray-300">
              Enter your business details to see how it performs online
            </h3>
          </div>
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
          <div className="p-6 space-y-6">
            <h2 className="text-xl font-normal">
              Enter your <span className="text-brand-violet-500">business name</span>
            </h2>
            <p className="text-gray-300 text-sm">
              We'll use this to analyze your online presence.
            </p>
            
            <SearchInput 
              placeholder="Enter your business name" 
              value={businessName}
              onChange={setBusinessName}
              onSubmit={handleBusinessNameSubmit}
            />
          </div>
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
