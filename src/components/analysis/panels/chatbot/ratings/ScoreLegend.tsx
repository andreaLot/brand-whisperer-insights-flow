
import React from 'react';
import { motion } from 'framer-motion';

const ScoreLegend: React.FC = () => {
  return (
    <motion.div 
      className="mt-4 flex justify-center gap-4 text-xs text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
        <span>Excellent (90+)</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-green-400"></div>
        <span>Good (80-89)</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
        <span>Average (60-79)</span>
      </div>
    </motion.div>
  );
};

export default ScoreLegend;
