
import React from 'react';
import { motion } from 'framer-motion';
import { CardTitle } from "@/components/ui/card";
import { BarChart2, RefreshCw } from "lucide-react";

interface RatingsTableTitleProps {
  isLoading?: boolean;
}

const RatingsTableTitle: React.FC<RatingsTableTitleProps> = ({ isLoading = false }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CardTitle className="text-lg font-medium flex items-center gap-2 text-white">
        <BarChart2 size={18} className="text-violet-400" />
        AI Platform Rankings
        {isLoading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="ml-2"
          >
            <RefreshCw size={16} className="text-violet-400/70" />
          </motion.div>
        )}
      </CardTitle>
    </motion.div>
  );
};

export default RatingsTableTitle;
