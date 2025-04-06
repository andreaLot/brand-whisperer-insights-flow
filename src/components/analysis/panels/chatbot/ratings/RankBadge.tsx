
import React from 'react';
import { motion } from 'framer-motion';

interface RankBadgeProps {
  rank: number | undefined;
}

const RankBadge: React.FC<RankBadgeProps> = ({ rank }) => {
  if (rank === undefined || rank === null) return null;
  
  // Get appropriate CSS classes based on rank
  const getRankBadgeClass = (rank: number) => {
    if (rank === 1) return "bg-amber-500/30 text-amber-200 ring-1 ring-amber-500/30";
    if (rank === 2) return "bg-slate-400/30 text-slate-200 ring-1 ring-slate-400/30";
    if (rank === 3) return "bg-amber-700/30 text-amber-300/80 ring-1 ring-amber-700/30";
    return "bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/20";
  };

  return (
    <motion.span 
      className={`px-2.5 py-1 rounded-full text-xs ${getRankBadgeClass(rank)}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      title={`Rank from AI analysis: ${rank}`}
    >
      #{rank}
    </motion.span>
  );
};

export default RankBadge;
