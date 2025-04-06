
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowDown, RefreshCw } from "lucide-react";

interface RatingsTableEmptyStateProps {
  isLoading: boolean;
}

const RatingsTableEmptyState: React.FC<RatingsTableEmptyStateProps> = ({ isLoading }) => {
  return (
    <div className="p-8 flex flex-col items-center justify-center text-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center py-4"
      >
        {isLoading ? (
          <div className="animate-pulse flex space-x-2">
            <div className="h-2 w-2 bg-violet-400 rounded-full"></div>
            <div className="h-2 w-2 bg-violet-400 rounded-full animation-delay-200"></div>
            <div className="h-2 w-2 bg-violet-400 rounded-full animation-delay-400"></div>
          </div>
        ) : (
          <AlertTriangle size={24} className="text-amber-400" />
        )}
      </motion.div>
      {isLoading ? (
        <>
          <p className="text-gray-300">Retrieving AI platform rankings...</p>
          <p className="text-gray-400 text-sm mt-1">Receiving data from multiple AI platforms.</p>
        </>
      ) : (
        <>
          <p className="text-gray-300">No ranking data available</p>
          <p className="text-gray-400 text-sm mt-1 flex items-center justify-center gap-1">
            <ArrowDown size={14} className="text-amber-400" /> Try running the analysis again to retrieve AI platform rankings
          </p>
        </>
      )}
    </div>
  );
};

export default RatingsTableEmptyState;
