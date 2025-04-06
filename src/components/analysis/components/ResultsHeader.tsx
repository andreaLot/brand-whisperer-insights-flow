
import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRightCircle, Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ResultsHeaderProps {
  businessName: string;
  location: string;
  category: string;
  model?: string;
  overallScore: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onStartOver: () => void;
}

const ResultsHeader: React.FC<ResultsHeaderProps> = ({ 
  businessName,
  location,
  category,
  model,
  overallScore,
  activeTab,
  setActiveTab,
  onStartOver
}) => {
  return (
    <motion.div 
      className="space-y-4"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between">
        <motion.h2 
          className="text-xl font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          Analysis for <span className="text-brand-blue-light">{businessName}</span>
        </motion.h2>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Button onClick={onStartOver} variant="outline" size="sm" className="flex items-center gap-1.5">
            <ArrowRightCircle size={15} />
            New Analysis
          </Button>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-3 gap-3 text-xs">
        {["location", "category", "score"].map((item, index) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
            className="bg-gray-800/50 p-2.5 rounded-lg border border-gray-700 flex items-center justify-center"
          >
            <span className="text-gray-400 mr-1.5">
              {item.charAt(0).toUpperCase() + item.slice(1)}:
            </span>
            <span className="font-medium">
              {item === "location" && location}
              {item === "category" && (
                <div className="flex items-center gap-1">
                  {category}
                  {model && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help">
                            <Info size={12} className="text-brand-blue-light" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Analysis by {model}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              )}
              {item === "score" && `${overallScore}/100`}
            </span>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="flex items-center space-x-2 border-b border-gray-700 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <button
          onClick={() => setActiveTab("results")}
          className={`px-4 py-2 border-b-2 text-sm transition-all ${
            activeTab === "results" 
              ? "border-brand-blue-light text-brand-blue-light" 
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Results
        </button>
        <button
          onClick={() => setActiveTab("summary")}
          className={`px-4 py-2 border-b-2 text-sm transition-all ${
            activeTab === "summary" 
              ? "border-brand-blue-light text-brand-blue-light" 
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Summary
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ResultsHeader;
