
import React from 'react';
import { motion } from 'framer-motion';
import RankBadge from './RankBadge';

interface RanksDisplayProps {
  platformResults: Array<{
    platform?: string;
    model?: string;
    score: number;
    rank?: number;
  }>;
}

const RanksDisplay: React.FC<RanksDisplayProps> = ({ platformResults }) => {
  if (!platformResults || platformResults.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {platformResults.map((result, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + (index * 0.1), duration: 0.3 }}
        >
          <RankBadge rank={result.rank} />
        </motion.div>
      ))}
    </div>
  );
};

export default RanksDisplay;
