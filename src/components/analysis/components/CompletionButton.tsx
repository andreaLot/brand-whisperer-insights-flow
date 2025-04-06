
import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface CompletionButtonProps {
  onAnalysisComplete: () => void;
}

const CompletionButton: React.FC<CompletionButtonProps> = ({ onAnalysisComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay: 0.4,
        ease: [0.22, 1, 0.36, 1] // Matching easing with video transition
      }}
      className="mt-8"
    >
      <Button 
        onClick={onAnalysisComplete}
        variant="dynamic" 
        size="xl" 
        className="w-full md:w-auto relative z-20" // Increased z-index to ensure button is clickable
      >
        View Results
      </Button>
    </motion.div>
  );
};

export default CompletionButton;
