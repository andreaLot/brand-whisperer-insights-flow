
import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
        variant="elegant"
        size="lg"
        className="w-full mt-4 relative z-20" // Increased z-index to ensure button is clickable
      >
        View Results <ArrowRight size={16} className="ml-1" />
      </Button>
    </motion.div>
  );
};

export default CompletionButton;
