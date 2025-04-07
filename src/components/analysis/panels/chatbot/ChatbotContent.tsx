
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RatingsTable from './ratings/RatingsTable';
import CompetitorsPanel from './CompetitorsPanel';
import SeoPanel from './SeoPanel';
import ContentPanel from './ContentPanel';
import ProfileCompleteness from './ProfileCompleteness';
import ReviewsPanel from './ReviewsPanel';
import { AnalysisResult, ApifyBusinessResult } from '@/services/types';

interface ChatbotContentProps {
  visibleSnippet: 'none' | 'competitors' | 'seo' | 'content' | 'ratings' | 'google-basics' | 'reviews';
  analysisResult: AnalysisResult | null;
  apifyBusinessResult?: ApifyBusinessResult | null;
  showGoogleBasics?: boolean;
  showReviews?: boolean;
}

const ChatbotContent: React.FC<ChatbotContentProps> = ({
  visibleSnippet,
  analysisResult,
  apifyBusinessResult,
  showGoogleBasics = false,
  showReviews = false
}) => {
  console.log("ChatbotContent: visibleSnippet =", visibleSnippet, 
    "showGoogleBasics =", showGoogleBasics,
    "showReviews =", showReviews);
  
  // Local state to track if panels should be shown
  const [showBasics, setShowBasics] = useState(showGoogleBasics);
  const [showReviewsPanel, setShowReviewsPanel] = useState(showReviews);
  
  // Listen for the specific events
  useEffect(() => {
    const handleCustomEvents = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== 'object') return;
      
      // Handle Google Basics click
      if (event.data.type === 'show-google-basics-click') {
        console.log("ChatbotContent: Received show-google-basics-click event, showing basics");
        setShowBasics(true);
      }
      
      // Handle Reviews click
      if (event.data.type === 'show-reviews-click') {
        console.log("ChatbotContent: Received show-reviews-click event, showing reviews");
        setShowReviewsPanel(true);
      }
    };
    
    window.addEventListener('message', handleCustomEvents);
    return () => window.removeEventListener('message', handleCustomEvents);
  }, []);
  
  // Update local state when props change
  useEffect(() => {
    if (showGoogleBasics) {
      console.log("ChatbotContent: showGoogleBasics prop is true, showing basics");
      setShowBasics(true);
    }
    if (showReviews) {
      console.log("ChatbotContent: showReviews prop is true, showing reviews");
      setShowReviewsPanel(true);
    }
  }, [showGoogleBasics, showReviews]);
  
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
      
      {visibleSnippet === 'reviews' && (
        <motion.div
          key="reviews"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <ReviewsPanel 
            apifyBusinessResult={apifyBusinessResult}
            isVisible={showReviewsPanel} 
            businessName={safeResult.businessName}
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
