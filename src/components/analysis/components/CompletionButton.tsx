
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
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
  );
};

export default CompletionButton;
