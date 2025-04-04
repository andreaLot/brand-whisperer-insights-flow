
import React from 'react';
import { motion } from 'framer-motion';

const AnalysisFooter: React.FC = () => {
  return (
    <motion.div 
      className="mt-12 text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
        <motion.span 
          className="bg-brand-blue-light/20 h-1 w-1 rounded-full"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            repeatType: "reverse" 
          }}
        ></motion.span>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          Brand Whisperer v1.0
        </motion.p>
        <motion.span 
          className="bg-brand-blue-light/20 h-1 w-1 rounded-full"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            repeatType: "reverse",
            delay: 1
          }}
        ></motion.span>
      </div>
    </motion.div>
  );
};

export default AnalysisFooter;
