
import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BarChart2 } from "lucide-react";

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
      className="flex flex-wrap gap-2 justify-center"
    >
      <Button
        variant="outline"
        size="lg"
        className="text-base bg-violet-500/30 border-violet-400 text-violet-100 hover:bg-violet-500/40 px-6 py-2 flex items-center gap-2"
        onClick={() => onOptionClick("View my ratings")}
        data-testid="view-ratings-button"
      >
        <BarChart2 size={18} className="text-violet-300" />
        View AI Search Rankings
      </Button>
    </motion.div>
  );
};

export default QuickOptions;
