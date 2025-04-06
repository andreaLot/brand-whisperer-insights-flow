
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import PlatformTableRow from './PlatformTableRow';
import { rowVariants } from './RatingsAnimations';

interface PlatformResult {
  platform?: string;
  model?: string;
  score: number;
  rank?: number;
}

interface RatingsResultsProps {
  results: PlatformResult[];
  visibleRows: number[];
}

const RatingsResults: React.FC<RatingsResultsProps> = ({ results, visibleRows }) => {
  // Sort results properly by rank
  const sortedResults = [...results].sort((a, b) => {
    if (a.rank !== undefined && b.rank !== undefined) {
      return a.rank - b.rank;
    }
    if (a.rank !== undefined) return -1;
    if (b.rank !== undefined) return 1;
    return b.score - a.score;
  });

  return (
    <Table>
      <TableHeader className="bg-gray-900/50">
        <TableRow>
          <TableHead className="w-[40px] text-white">#</TableHead>
          <TableHead className="text-white">Platform</TableHead>
          <TableHead className="text-right text-white">Score</TableHead>
          <TableHead className="text-right text-white">Rank</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedResults.map((result, index) => (
          <PlatformTableRow 
            key={`platform-${index}-${result.platform}`}
            result={result}
            index={index}
            isVisible={visibleRows.includes(index)}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default RatingsResults;
