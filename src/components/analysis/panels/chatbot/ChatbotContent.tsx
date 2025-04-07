import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RatingsTable from './ratings/RatingsTable';
import CompetitorsPanel from './CompetitorsPanel';
import SeoPanel from './SeoPanel';
import ContentPanel from './ContentPanel';
import ProfileCompleteness from './ProfileCompleteness';
import { AnalysisResult, ApifyBusinessResult } from '@/services/types';

interface ChatbotContentProps {
  visibleSnippet: 'none' | 'competitors' | 'seo' | 'content' | 'ratings' | 'google-basics';
  analysisResult: AnalysisResult | null;
  apifyBusinessResult?: ApifyBusinessResult | null;
  showGoogleBasics?: boolean;
}

const ChatbotContent: React.FC<ChatbotContentProps> = ({
  visibleSnippet,
  analysisResult,
  apifyBusinessResult,
  showGoogleBasics = false
}) => {
  console.log("ChatbotContent: visibleSnippet =", visibleSnippet, "showGoogleBasics =", showGoogleBasics);
  
  // Local state to track if Google Basics should be shown
  const [showBasics, setShowBasics] = useState(showGoogleBasics);
  
  // Listen for the specific event from the button click
  useEffect(() => {
    const handleShowBasicsClick = (event: MessageEvent) => {
      if (event.data && event.data.type === 'show-google-basics-click') {
        console.log("ChatbotContent: Received show-google-basics-click event, showing basics");
        setShowBasics(true);
      }
    };
    
    window.addEventListener('message', handleShowBasicsClick);
    return () => window.removeEventListener('message', handleShowBasicsClick);
  }, []);
  
  // Update local state when prop changes
  useEffect(() => {
    if (showGoogleBasics) {
      setShowBasics(true);
    }
  }, [showGoogleBasics]);
  
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
      
      {visibleSnippet === 'google-basics' && (
        <motion.div
          key="google-basics"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <ProfileCompleteness 
            apifyBusinessResult={apifyBusinessResult}
            isVisible={showBasics} 
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
