
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
  
  // Define platforms with their specific colors
  const platforms = [
    { name: "Gemini", color: "#33C3F0" },      // Ocean blue
    { name: "OpenAI", color: "#8B5CF6" },      // Vivid purple
    { name: "Perplexity", color: "#F97316" },  // Bright orange
    { name: "Grok", color: "#ea384c" }         // Red
  ];
  
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
          className="text-2xl font-medium mb-4 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-brand-blue-light">Checking</span> your visibility for {categoryText}
        </motion.h2>
        
        <AnimatePresence mode="wait">
          <motion.p 
            key={platforms[currentPlatformIndex].name}
            className="text-xl text-center font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            Currently checking on{" "}
            <span style={{ color: platforms[currentPlatformIndex].color }} className="font-bold">
              {platforms[currentPlatformIndex].name}
            </span>
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
