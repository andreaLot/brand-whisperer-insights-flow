
import React from 'react';
import { motion } from 'framer-motion';
import { ApifyBusinessResult, AnalysisResult } from "@/services/types";
import ChatbotContent from '../chatbot/ChatbotContent';

interface ChatbotPanelsProps {
  activePanels: Array<'none' | 'competitors' | 'seo' | 'content' | 'ratings' | 'google-basics'>;
  analysisResult: AnalysisResult | null;
  apifyBusinessResult?: ApifyBusinessResult | null;
  animationProps: any;
}

const ChatbotPanels: React.FC<ChatbotPanelsProps> = ({ 
  activePanels, 
  analysisResult, 
  apifyBusinessResult,
  animationProps
}) => {
  return (
    <motion.div
      key="chatbot"
      {...animationProps}
      className="space-y-6"
    >
      {/* Show all active panels in order */}
      {activePanels.includes('ratings') && (
        <ChatbotContent 
          visibleSnippet="ratings"
          analysisResult={analysisResult}
          apifyBusinessResult={apifyBusinessResult}
        />
      )}
      
      {activePanels.includes('google-basics') && (
        <ChatbotContent 
          visibleSnippet="google-basics"
          analysisResult={analysisResult}
          apifyBusinessResult={apifyBusinessResult}
        />
      )}
      
      {activePanels.includes('competitors') && (
        <ChatbotContent 
          visibleSnippet="competitors"
          analysisResult={analysisResult}
          apifyBusinessResult={apifyBusinessResult}
        />
      )}
      
      {activePanels.includes('seo') && (
        <ChatbotContent 
          visibleSnippet="seo"
          analysisResult={analysisResult}
          apifyBusinessResult={apifyBusinessResult}
        />
      )}
      
      {activePanels.includes('content') && (
        <ChatbotContent 
          visibleSnippet="content"
          analysisResult={analysisResult}
          apifyBusinessResult={apifyBusinessResult}
        />
      )}
    </motion.div>
  );
};

export default ChatbotPanels;
