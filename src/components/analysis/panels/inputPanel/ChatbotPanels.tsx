
import React, { useState, useEffect } from 'react';
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
  const [showGoogleBasics, setShowGoogleBasics] = useState(false);
  
  // Listen for the custom event to show Google basics
  useEffect(() => {
    const handleShowBasics = (event: MessageEvent) => {
      if (event.data && event.data.type === 'show-google-basics-click') {
        console.log("ChatbotPanels: Received show-google-basics-click event", event.data);
        setShowGoogleBasics(true);
      }
    };
    
    window.addEventListener('message', handleShowBasics);
    return () => {
      window.removeEventListener('message', handleShowBasics);
    };
  }, []);

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
          showGoogleBasics={showGoogleBasics}
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
