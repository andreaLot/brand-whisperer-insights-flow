
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RatingsTable from './ratings/RatingsTable';
import CompetitorsPanel from './CompetitorsPanel';
import SeoPanel from './SeoPanel';
import ContentPanel from './ContentPanel';
import ProfileCompletenessPanel from '../ProfileCompletenessPanel';
import { AnalysisResult, ApifyBusinessResult } from '@/services/types';

interface ChatbotContentProps {
  visibleSnippet: 'none' | 'competitors' | 'seo' | 'content' | 'ratings' | 'profile';
  analysisResult: AnalysisResult | null;
  apifyBusinessResult?: ApifyBusinessResult | null;
}

const ChatbotContent: React.FC<ChatbotContentProps> = ({
  visibleSnippet,
  analysisResult,
  apifyBusinessResult
}) => {
  console.log("ChatbotContent received analysisResult:", analysisResult);
  console.log("ChatbotContent visibleSnippet:", visibleSnippet);
  
  // Create a safe default if analysisResult is null
  const safeResult: AnalysisResult = analysisResult || {
    businessName: "Your Business",
    location: "",
    category: "",
    overallScore: 85,
    platformResults: [],
    strengths: [],
    weaknesses: [],
    recommendations: []
  };
  
  // Log platform results specifically for debugging
  console.log("Platform results:", safeResult.platformResults);

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
            businessName={safeResult.businessName} 
            platformResults={safeResult.platformResults || []} 
          />
        </motion.div>
      )}
      
      {visibleSnippet === 'profile' && (
        <motion.div
          key="profile"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <ProfileCompletenessPanel apifyBusinessResult={apifyBusinessResult} />
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
          <CompetitorsPanel 
            analysisResult={safeResult} 
            apifyBusinessResult={apifyBusinessResult} 
          />
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
          <SeoPanel 
            analysisResult={safeResult} 
          />
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
          <ContentPanel 
            analysisResult={safeResult} 
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatbotContent;
