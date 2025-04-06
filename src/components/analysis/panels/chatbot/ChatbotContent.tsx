import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SeoPanel from './SeoPanel';
import ContentPanel from './ContentPanel';
import { ApifyBusinessResult } from "@/services/AnalysisService";
import RatingsTable from './RatingsTable';

interface ChatbotContentProps {
  visibleSnippet: 'none' | 'competitors' | 'seo' | 'content' | 'ratings';
  analysisResult?: any;
  apifyBusinessResult?: ApifyBusinessResult | null;
}

const ChatbotContent: React.FC<ChatbotContentProps> = ({ 
  visibleSnippet, 
  analysisResult,
  apifyBusinessResult
}) => {
  // Animation variants for content transition
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.19, 1.0, 0.22, 1.0]
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  // For competitors snippet, we'll show business details
  if (visibleSnippet === 'competitors') {
    return (
      <motion.div 
        className="bg-brand-gray-dark rounded-lg p-6 border border-gray-700"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={contentVariants}
      >
        <h3 className="text-lg font-medium mb-4">Business Details</h3>
        {apifyBusinessResult ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Business Name:</span>
              <span className="text-brand-blue-light">{apifyBusinessResult.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Category:</span>
              <span>{apifyBusinessResult.category || 'Not available'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Rating:</span>
              <span>{apifyBusinessResult.rating || 'Not available'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Reviews:</span>
              <span>{apifyBusinessResult.reviewsCount || '0'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Address:</span>
              <span className="text-sm text-right">{apifyBusinessResult.address || 'Not available'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Website:</span>
              <span className="text-brand-blue-light text-sm">
                {apifyBusinessResult.website ? (
                  <a href={apifyBusinessResult.website} target="_blank" rel="noopener noreferrer">
                    {apifyBusinessResult.website}
                  </a>
                ) : 'Not available'}
              </span>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center py-8"
          >
            <div className="animate-pulse flex space-x-2">
              <div className="h-2 w-2 bg-brand-blue-light rounded-full"></div>
              <div className="h-2 w-2 bg-brand-blue-light rounded-full"></div>
              <div className="h-2 w-2 bg-brand-blue-light rounded-full"></div>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  }

  if (visibleSnippet === 'seo') {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={contentVariants}
      >
        <SeoPanel />
      </motion.div>
    );
  }

  if (visibleSnippet === 'content') {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={contentVariants}
      >
        <ContentPanel category={analysisResult?.category || apifyBusinessResult?.category} />
      </motion.div>
    );
  }

  if (visibleSnippet === 'ratings') {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={contentVariants}
      >
        <RatingsTable 
          businessName={analysisResult?.businessName || apifyBusinessResult?.name || "Your Business"} 
          platformResults={analysisResult?.platformResults || []}
        />
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-brand-gray-dark rounded-lg p-6 border border-gray-700 flex items-center justify-center min-h-[200px]"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={contentVariants}
    >
      <p className="text-gray-400 text-center">Select an option from the chatbot to see relevant insights</p>
    </motion.div>
  );
};

export default ChatbotContent;
