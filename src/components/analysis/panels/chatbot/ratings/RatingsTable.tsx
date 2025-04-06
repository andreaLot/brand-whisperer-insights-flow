
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, AlertTriangle } from "lucide-react";
import PlatformTableRow from './PlatformTableRow';
import ScoreLegend from './ScoreLegend';
import TableFooter from './TableFooter';

interface PlatformResult {
  platform?: string;
  model?: string;
  score: number;
  rank?: number;
}

interface RatingsTableProps {
  businessName: string;
  platformResults: PlatformResult[];
}

const RatingsTable: React.FC<RatingsTableProps> = ({ businessName, platformResults }) => {
  const [visibleRows, setVisibleRows] = useState<number[]>([]);
  const [cardVisible, setCardVisible] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [legendVisible, setLegendVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  // Important: Make sure we have an array, even if empty
  const results = Array.isArray(platformResults) ? platformResults : [];
  
  // Debug logs
  useEffect(() => {
    console.log("RatingsTable received platformResults:", results);
    console.log("Platform results data type:", typeof platformResults);
    console.log("Platform results length:", results.length);
  }, [results]);
  
  // Animate the table rows one by one with a staggered delay
  useEffect(() => {
    // First show the card container
    setTimeout(() => setCardVisible(true), 300);
    
    // Then show the title
    setTimeout(() => setTitleVisible(true), 800);
    
    // Only start animating rows if we have results
    if (results.length > 0) {
      results.forEach((_, index) => {
        setTimeout(() => {
          setVisibleRows(prev => [...prev, index]);
        }, 1200 + (index * 600)); // 600ms delay between each row
      });
      
      // Finally show the legend and footer
      setTimeout(() => setLegendVisible(true), 1200 + (results.length * 600) + 300);
      setTimeout(() => setFooterVisible(true), 1200 + (results.length * 600) + 800);
    } else {
      // If no results, show the legend and footer sooner
      setTimeout(() => setLegendVisible(true), 1200);
      setTimeout(() => setFooterVisible(true), 1800);
    }
  }, [results.length]);

  // Sort results properly by rank
  const sortedResults = [...results].sort((a, b) => {
    // If both have ranks, sort by rank
    if (a.rank !== undefined && b.rank !== undefined) {
      return a.rank - b.rank;
    }
    // If only one has a rank, prioritize the one with rank
    if (a.rank !== undefined) return -1;
    if (b.rank !== undefined) return 1;
    // If neither has a rank, sort by score
    return b.score - a.score;
  });

  return (
    <AnimatePresence>
      {cardVisible && (
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <Card className="border-violet-500/20 bg-violet-900/10 backdrop-blur-sm shadow-lg shadow-violet-900/10">
            <CardHeader className="pb-3">
              <AnimatePresence>
                {titleVisible && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <CardTitle className="text-lg font-medium flex items-center gap-2 text-white">
                      <BarChart2 size={18} className="text-violet-400" />
                      AI Platform Ratings
                    </CardTitle>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardHeader>
            <CardContent>
              <div className="relative rounded-xl overflow-hidden border border-violet-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/10 pointer-events-none" />
                
                {sortedResults.length > 0 ? (
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
                          key={index}
                          result={result}
                          index={index}
                          isVisible={visibleRows.includes(index)}
                        />
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="p-8 flex flex-col items-center justify-center text-center">
                    <AlertTriangle className="text-amber-400 mb-2" size={24} />
                    <p className="text-gray-300">Generating platform results...</p>
                    <p className="text-gray-400 text-sm mt-1">Platform rankings will appear momentarily.</p>
                  </div>
                )}
              </div>
              
              {/* Score legend */}
              <AnimatePresence>
                {legendVisible && <ScoreLegend />}
              </AnimatePresence>
            </CardContent>
          </Card>
          
          <AnimatePresence>
            {footerVisible && <TableFooter businessName={businessName} />}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RatingsTable;
