
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
  const [isLoading, setIsLoading] = useState(true);

  // Important: Make sure we have an array, even if empty
  const results = Array.isArray(platformResults) ? platformResults : [];
  
  // Reset animation states when platform results change
  useEffect(() => {
    console.log("RatingsTable received updated platformResults:", results);
    
    // Reset animation states
    setVisibleRows([]);
    setCardVisible(false);
    setTitleVisible(false);
    setLegendVisible(false);
    setFooterVisible(false);
    
    // Start animations on next tick
    setTimeout(() => {
      startAnimations(results);
    }, 100);
    
    // Mark as no longer loading if we have results or after 5 seconds
    if (results.length > 0) {
      setIsLoading(false);
    } else {
      // If no results yet, set a timeout to stop showing the loading state after 5 seconds
      const loadingTimeout = setTimeout(() => {
        setIsLoading(false);
      }, 5000);
      
      return () => clearTimeout(loadingTimeout);
    }
  }, [platformResults]);
  
  const startAnimations = (results: PlatformResult[]) => {
    // First show the card container
    setCardVisible(true);
    
    // Then show the title
    setTimeout(() => setTitleVisible(true), 500);
    
    // Only start animating rows if we have results
    if (results.length > 0) {
      results.forEach((_, index) => {
        setTimeout(() => {
          setVisibleRows(prev => [...prev, index]);
        }, 1000 + (index * 300)); // 300ms delay between each row
      });
      
      // Finally show the legend and footer
      setTimeout(() => setLegendVisible(true), 1000 + (results.length * 300) + 300);
      setTimeout(() => setFooterVisible(true), 1000 + (results.length * 300) + 600);
    } else {
      // If no results, show the legend and footer sooner
      setTimeout(() => setLegendVisible(true), 1000);
      setTimeout(() => setFooterVisible(true), 1500);
    }
  };

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
                      AI Platform Rankings
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
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="flex items-center justify-center py-4"
                    >
                      {isLoading ? (
                        <div className="animate-pulse flex space-x-2">
                          <div className="h-2 w-2 bg-violet-400 rounded-full"></div>
                          <div className="h-2 w-2 bg-violet-400 rounded-full animation-delay-200"></div>
                          <div className="h-2 w-2 bg-violet-400 rounded-full animation-delay-400"></div>
                        </div>
                      ) : (
                        <AlertTriangle size={24} className="text-amber-400" />
                      )}
                    </motion.div>
                    {isLoading ? (
                      <>
                        <p className="text-gray-300">Fetching AI platform rankings...</p>
                        <p className="text-gray-400 text-sm mt-1">Results will appear shortly.</p>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-300">No ranking data available</p>
                        <p className="text-gray-400 text-sm mt-1">Try running the analysis again to retrieve AI platform rankings.</p>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {/* Score legend */}
              <AnimatePresence>
                {legendVisible && sortedResults.length > 0 && <ScoreLegend />}
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
