
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ApifyBusinessResult, AnalysisResult } from "@/services/types";
import ChatbotContent from '../chatbot/ChatbotContent';

interface ChatbotPanelsProps {
  activePanels: Array<'none' | 'competitors' | 'seo' | 'content' | 'ratings' | 'google-basics' | 'reviews'>;
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
  const [showGoogleBasics, setShowGoogleBasics] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showRatingsSkeleton, setShowRatingsSkeleton] = useState(false);
  
  // Listen for custom events to show different panels
  useEffect(() => {
    const handleCustomEvents = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== 'object') return;
      
      // Handle Google Basics panel
      if (event.data.type === 'show-google-basics-click') {
        console.log("ChatbotPanels: Received show-google-basics-click event", event.data);
        setShowGoogleBasics(true);
      }
      
      // Handle Reviews panel
      if (event.data.type === 'show-reviews-click') {
        console.log("ChatbotPanels: Received show-reviews-click event", event.data);
        setShowReviews(true);
      }
      
      // Handle ratings with skeleton
      if (event.data.type === 'chatbot-selection' && event.data.message === 'ratings') {
        if (event.data.showSkeleton === true) {
          console.log("ChatbotPanels: Showing ratings skeleton immediately");
          setShowRatingsSkeleton(true);
        }
      }
    };
    
    window.addEventListener('message', handleCustomEvents);
    return () => {
      window.removeEventListener('message', handleCustomEvents);
    };
  }, []);

  return (
    <motion.div
      key="chatbot"
      {...animationProps}
      className="space-y-6 max-h-[calc(100vh-200px)] overflow-auto"
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
          showGoogleBasics={showGoogleBasics}
        />
      )}
      
      {activePanels.includes('reviews') && (
        <ChatbotContent 
          visibleSnippet="reviews"
          analysisResult={analysisResult}
          apifyBusinessResult={apifyBusinessResult}
          showReviews={showReviews}
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
