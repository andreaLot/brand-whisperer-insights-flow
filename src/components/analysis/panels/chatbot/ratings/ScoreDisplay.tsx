
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  const getScoreColorClass = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 80) return "text-green-400";
    if (score >= 70) return "text-lime-400";
    if (score >= 60) return "text-yellow-400";
    return "text-orange-500";
  };

  return (
    <motion.div 
      className={`inline-flex items-center gap-1 ${getScoreColorClass(score)}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <span className="text-lg">{score}</span>
      <span className="text-xs text-white">/100</span>
      
      {score >= 90 && (
        <motion.div
          initial={{ rotate: -20, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 400 }}
        >
          <Star size={14} className="text-amber-400 fill-amber-400 ml-1" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default ScoreDisplay;
