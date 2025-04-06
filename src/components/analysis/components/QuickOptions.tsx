
import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface QuickOptionsProps {
  showOptions: boolean;
  isFinalPhase: boolean;
  onOptionClick: (message: string) => void;
  forceShow?: boolean;
}

const QuickOptions: React.FC<QuickOptionsProps> = ({ 
  showOptions, 
  isFinalPhase, 
  onOptionClick,
  forceShow = false
}) => {
  if ((!showOptions && !forceShow) || isFinalPhase) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="flex flex-wrap gap-2"
    >
      <Button
        variant="outline"
        size="sm"
        className="text-xs bg-violet-500/20 border-violet-400 text-violet-100 hover:bg-violet-500/30"
        onClick={() => onOptionClick("Show my ratings across AI platforms")}
      >
        See my ratings
      </Button>
    </motion.div>
  );
};

export default QuickOptions;
