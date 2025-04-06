
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { BadgeCheck, Search, PanelLeftOpen, FileText, BarChart3 } from 'lucide-react';

interface QuickOptionsProps {
  showOptions: boolean;
  isFinalPhase: boolean;
  onOptionClick: (text: string) => void;
  forceShow?: boolean;
}

const QuickOptions: React.FC<QuickOptionsProps> = ({ 
  showOptions, 
  isFinalPhase,
  onOptionClick,
  forceShow = false
}) => {
  const shouldShow = showOptions || forceShow;

  // Options shown in the initial phase (before the ratings table is shown)
  const initialOptions = [
    { text: "Show me my ranking", icon: <BarChart3 className="w-4 h-4 mr-2" /> },
    { text: "Analyze my profile", icon: <BadgeCheck className="w-4 h-4 mr-2" /> },
  ];

  // Options shown in the final phase (after the ratings table is shown)
  const finalOptions = [
    { text: "Show rankings", icon: <BarChart3 className="w-4 h-4 mr-2" />, action: "ratings" },
    { text: "Profile completeness", icon: <BadgeCheck className="w-4 h-4 mr-2" />, action: "profile" },
    { text: "Competitors", icon: <PanelLeftOpen className="w-4 h-4 mr-2" />, action: "competitors" },
    { text: "SEO", icon: <Search className="w-4 h-4 mr-2" />, action: "seo" },
    { text: "Content", icon: <FileText className="w-4 h-4 mr-2" />, action: "content" },
  ];

  const options = isFinalPhase ? finalOptions : initialOptions;

  const handleClick = (option: any) => {
    // First dispatch a message to show the appropriate panel
    if (isFinalPhase && option.action) {
      window.postMessage({ type: 'chatbot-selection', message: option.action }, '*');
    }
    
    // Then call the onOptionClick handler for managing chat messages
    onOptionClick(option.text);
  };

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="flex flex-wrap gap-2 mt-4"
        >
          {options.map((option, index) => (
            <Button 
              key={index}
              variant="outline"
              className="flex items-center border-brand-gray-light bg-brand-black/40 hover:bg-brand-blue/10"
              onClick={() => handleClick(option)}
            >
              {option.icon}
              {option.text}
            </Button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickOptions;
