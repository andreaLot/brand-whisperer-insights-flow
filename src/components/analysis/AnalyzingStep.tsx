
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface AnalyzingStepProps {
  businessName: string;
  primaryCategory?: string;
  location?: string;
  onAnalysisComplete?: () => void;
}

const AnalyzingStep: React.FC<AnalyzingStepProps> = ({ 
  businessName,
  primaryCategory, 
  location,
  onAnalysisComplete
}) => {
  const categoryText = primaryCategory || "your business category";
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Simulate analysis completion after a delay
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h2 
        className="text-xl font-medium mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        We are checking your visibility for <span className="text-brand-blue-light">{categoryText}</span> on Gemini, Grok, Perplexity, OpenAI
      </motion.h2>
      
      {isReady && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mt-8"
        >
          <Button 
            variant="elegant" 
            size="lg" 
            onClick={onAnalysisComplete}
            className="px-8"
          >
            View Results
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AnalyzingStep;
