
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RatingsTable from './ratings/RatingsTable';
import CompetitorsPanel from './CompetitorsPanel';
import SeoPanel from './SeoPanel';
import ContentPanel from './ContentPanel';
import { AnalysisResult, ApifyBusinessResult } from '@/services/types';

interface ChatbotContentProps {
  visibleSnippet: 'none' | 'competitors' | 'seo' | 'content' | 'ratings';
  analysisResult: AnalysisResult | null;
  apifyBusinessResult?: ApifyBusinessResult | null;
}

const ChatbotContent: React.FC<ChatbotContentProps> = ({
  visibleSnippet,
  analysisResult,
  apifyBusinessResult
}) => {
  console.log("ChatbotContent received analysisResult:", analysisResult);
  console.log("Rendering snippet:", visibleSnippet);
  
  if (!analysisResult) {
    console.log("No analysis result available for ChatbotContent");
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {visibleSnippet === 'ratings' && (
        <motion.div
          key="ratings"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <RatingsTable 
            businessName={analysisResult.businessName} 
            platformResults={analysisResult.platformResults || []} 
          />
        </motion.div>
      )}
      
      {visibleSnippet === 'competitors' && (
        <motion.div
          key="competitors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <CompetitorsPanel analysisResult={analysisResult} apifyBusinessResult={apifyBusinessResult} />
        </motion.div>
      )}
      
      {visibleSnippet === 'seo' && (
        <motion.div
          key="seo"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <SeoPanel analysisResult={analysisResult} />
        </motion.div>
      )}
      
      {visibleSnippet === 'content' && (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <ContentPanel analysisResult={analysisResult} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatbotContent;
