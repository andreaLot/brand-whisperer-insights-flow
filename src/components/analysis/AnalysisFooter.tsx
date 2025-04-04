
import React from 'react';
import { motion } from 'framer-motion';

const AnalysisFooter: React.FC = () => {
  return (
    <motion.div 
      className="mt-12 text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
        <span className="bg-brand-blue-light/20 h-1 w-1 rounded-full"></span>
        <p>Brand Whisperer v1.0</p>
        <span className="bg-brand-blue-light/20 h-1 w-1 rounded-full"></span>
      </div>
    </motion.div>
  );
};

export default AnalysisFooter;
