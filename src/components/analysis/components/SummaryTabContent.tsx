
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import SummaryBox from "@/components/SummaryBox";

interface SummaryTabContentProps {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

const SummaryTabContent: React.FC<SummaryTabContentProps> = ({ 
  overallScore,
  strengths,
  weaknesses,
  recommendations 
}) => {
  const [showSummary, setShowSummary] = useState(false);
  
  useEffect(() => {
    // Show summary with slight delay for animation effect
    const timer = setTimeout(() => {
      setShowSummary(true);
    }, 400); // Reduced delay for smoother experience
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      key="summary"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4 }}
      className="bg-transparent"
    >
      {showSummary && (
        <SummaryBox 
          overallScore={overallScore} 
          strengths={strengths} 
          weaknesses={weaknesses} 
          recommendations={recommendations} 
        />
      )}
    </motion.div>
  );
};

export default SummaryTabContent;
