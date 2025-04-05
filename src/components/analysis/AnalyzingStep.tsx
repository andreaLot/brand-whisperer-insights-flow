
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import PlatformRotator from './components/PlatformRotator';
import CompletionButton from './components/CompletionButton';
import useProgressTracker from './hooks/useProgressTracker';

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
  // Simplify category text to only show first part before underscore or space
  const simplifyCategory = (category: string): string => {
    // Split by underscore or space and take first part
    return category?.split(/[_\s]/)[0] || "business";
  };
  
  const categoryText = primaryCategory ? simplifyCategory(primaryCategory) : "your business";
  
  // Define platforms with their specific colors
  const platforms = [
    { name: "Gemini", color: "#33C3F0" },      // Ocean blue
    { name: "OpenAI", color: "#8B5CF6" },      // Vivid purple
    { name: "Perplexity", color: "#F97316" },  // Bright orange
    { name: "Grok", color: "#ea384c" }         // Red
  ];
  
  const [textOpacity, setTextOpacity] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Use the ProgressTracker hook
  const { progress, isComplete: progressComplete } = useProgressTracker({
    onComplete: () => setIsComplete(true)
  });

  // Modified the component to remove typewriter effect and display as a fade-in text block
  useEffect(() => {
    // Fade in the text container
    setTextOpacity(1);
  }, []);

  return (
    <motion.div 
      className="space-y-6 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      <motion.div 
        className="mb-12 text-center max-w-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: textOpacity }}
        transition={{ duration: 1.2 }}
      >
        <motion.h2 
          className="text-3xl font-tiempos mb-8 tracking-tight leading-relaxed"
        >
          We are looking how you perform in{' '}
          <span className="text-brand-blue-light font-semibold">{categoryText}</span>
          {' '}in your area
        </motion.h2>
        
        <PlatformRotator platforms={platforms} isComplete={isComplete} />
      </motion.div>
      
      {isComplete && (
        <CompletionButton onAnalysisComplete={onAnalysisComplete!} />
      )}
    </motion.div>
  );
};

export default AnalyzingStep;
