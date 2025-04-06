
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TableCell, TableRow } from "@/components/ui/table";
import PlatformIcon from './PlatformIcon';
import ScoreDisplay from './ScoreDisplay';
import RankBadge from './RankBadge';

interface PlatformResult {
  platform?: string;
  model?: string;
  score: number;
  rank?: number;
}

interface PlatformTableRowProps {
  result: PlatformResult;
  index: number;
  isVisible: boolean;
}

const PlatformTableRow: React.FC<PlatformTableRowProps> = ({
  result,
  index,
  isVisible
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.tr
          className="border-b border-gray-800 hover:bg-violet-950/10 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            duration: 0.6
          }}
        >
          <TableCell className="font-mono text-sm text-white">
            {index + 1}
          </TableCell>
          <TableCell>
            <motion.div 
              className="flex items-center gap-2"
              initial={{ x: -5, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="p-1 rounded-full bg-gray-800/50 flex items-center justify-center">
                <PlatformIcon platform={result.platform || result.model} />
              </div>
              <span className="font-medium text-white">{result.platform || result.model || `Platform ${index + 1}`}</span>
            </motion.div>
          </TableCell>
          <TableCell className="text-right font-mono">
            <ScoreDisplay score={result.score} />
          </TableCell>
          <TableCell className="text-right font-medium">
            <RankBadge rank={result.rank} />
          </TableCell>
        </motion.tr>
      )}
    </AnimatePresence>
  );
};

export default PlatformTableRow;
