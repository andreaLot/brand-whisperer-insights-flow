
import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BarChart2, Code } from "lucide-react";

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
  // Always show in chatbot step unless in final phase
  if ((!showOptions && !forceShow) || isFinalPhase) return null;

  const handleRatingsClick = () => {
    // First post message to trigger skeleton loading immediately
    window.postMessage({ 
      type: 'chatbot-selection', 
      message: 'ratings',
      showSkeleton: true 
    }, '*');
    
    // Then trigger the analysis by sending the message
    onOptionClick("Show me the current AI platform rankings");
  };

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
        className="text-base bg-uberall-ultraviolet/30 border-uberall-ultraviolet/50 text-white hover:bg-uberall-ultraviolet/40 px-6 py-2 flex items-center gap-2"
        onClick={handleRatingsClick}
        data-testid="view-ratings-button"
      >
        <BarChart2 size={18} className="text-uberall-rosa" />
        View AI Platform Rankings
      </Button>
    </motion.div>
  );
};

export default QuickOptions;
