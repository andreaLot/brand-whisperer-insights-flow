
import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface CompletionButtonProps {
  onAnalysisComplete?: () => void;
}

const CompletionButton: React.FC<CompletionButtonProps> = ({ onAnalysisComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center w-full"
    >
      <Button
        onClick={onAnalysisComplete}
        variant="dynamic"
        size="lg"
        className="w-full md:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
      >
        Continue
      </Button>
    </motion.div>
  );
};

export default CompletionButton;
