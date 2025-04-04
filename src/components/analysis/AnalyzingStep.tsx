
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface AnalyzingStepProps {
  primaryCategory?: string;
  location?: string;
  onAnalysisComplete?: () => void;
}

const AnalyzingStep: React.FC<AnalyzingStepProps> = ({ 
  primaryCategory, 
  location,
  onAnalysisComplete
}) => {
  const categoryText = primaryCategory || "your business category";
  const platforms = ["Gemini", "OpenAI", "Perplexity", "Grok"];
  const [currentPlatformIndex, setCurrentPlatformIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Handle platform rotation with fade effect
  useEffect(() => {
    // If analysis is complete, don't continue the animation
    if (isComplete) return;

    const fadeInterval = setInterval(() => {
      setIsVisible(false);
      
      // Wait for fade out, then change platform and fade in
      setTimeout(() => {
        setCurrentPlatformIndex(prevIndex => (prevIndex + 1) % platforms.length);
        setIsVisible(true);
      }, 600);
    }, 2000); // Change platform every 2 seconds

    return () => clearInterval(fadeInterval);
  }, [platforms.length, isComplete]);
  
  // Handle progress and completion
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + 0.5;
        
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setIsComplete(true);
          return 100;
        }
        
        return newProgress;
      });
    }, 150); // Slower progress to give time for the animation
    
    return () => clearInterval(progressInterval);
  }, []);
  
  // Handle completion
  useEffect(() => {
    if (isComplete && onAnalysisComplete) {
      // Wait a moment before triggering completion
      const timeout = setTimeout(() => {
        onAnalysisComplete();
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [isComplete, onAnalysisComplete]);

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <motion.h2 
          className="text-xl font-medium mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-brand-blue-light">Checking</span> your visibility for {categoryText}
        </motion.h2>
        
        <AnimatePresence mode="wait">
          <motion.p 
            key={platforms[currentPlatformIndex]}
            className="text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            Currently checking on <span className="text-brand-blue-light font-medium">{platforms[currentPlatformIndex]}</span>
          </motion.p>
        </AnimatePresence>
      </div>
      
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <Button 
            onClick={onAnalysisComplete}
            variant="elegant"
            size="lg"
            className="w-full mt-4"
          >
            View Results <ArrowRight size={16} />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AnalyzingStep;
