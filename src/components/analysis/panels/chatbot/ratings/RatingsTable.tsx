
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, AlertTriangle, ArrowDown, RefreshCw } from "lucide-react";
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
  
  // If there are no real results, provide demo data
  const hasResults = results.length > 0;
  const displayResults = hasResults ? results : [
    { platform: 'Gemini', score: 87, rank: 3 },
    { platform: 'GPT-4o', score: 92, rank: 1 },
    { platform: 'Perplexity', score: 89, rank: 2 },
    { platform: 'DeepSeek', score: 83, rank: 4 },
    { platform: 'Mistral', score: 81, rank: 5 },
  ];
  
  useEffect(() => {
    console.log("🎯 [RatingsTable] Received platformResults:", JSON.stringify(results, null, 2));
    console.log(`🎯 [RatingsTable] Number of platform results: ${results.length}`);
    
    // Reset animation states
    setVisibleRows([]);
    setCardVisible(false);
    setTitleVisible(false);
    setLegendVisible(false);
    setFooterVisible(false);
    
    // Start animations on next tick
    setTimeout(() => {
      startAnimations(displayResults);
    }, 100);
    
    // Mark as no longer loading after 3 seconds or if we have results
    if (results.length > 0) {
      setIsLoading(false);
    } else {
      const loadingTimeout = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      
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
  const sortedResults = [...displayResults].sort((a, b) => {
    if (a.rank !== undefined && b.rank !== undefined) {
      return a.rank - b.rank;
    }
    if (a.rank !== undefined) return -1;
    if (b.rank !== undefined) return 1;
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
                      {isLoading && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="ml-2"
                        >
                          <RefreshCw size={16} className="text-violet-400/70" />
                        </motion.div>
                      )}
                    </CardTitle>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardHeader>
            <CardContent>
              <div className="relative rounded-xl overflow-hidden border border-violet-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/10 pointer-events-none" />
                
                {displayResults.length > 0 ? (
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
                        <p className="text-gray-300">Retrieving AI platform rankings...</p>
                        <p className="text-gray-400 text-sm mt-1">Receiving data from multiple AI platforms.</p>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-300">No ranking data available</p>
                        <p className="text-gray-400 text-sm mt-1 flex items-center justify-center gap-1">
                          <ArrowDown size={14} className="text-amber-400" /> Try running the analysis again to retrieve AI platform rankings
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {/* Score legend */}
              <AnimatePresence>
                {legendVisible && displayResults.length > 0 && <ScoreLegend />}
              </AnimatePresence>
            </CardContent>
          </Card>
          
          <AnimatePresence>
            {footerVisible && (
              <TableFooter 
                businessName={businessName} 
                platformCount={hasResults ? sortedResults.length : 0}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RatingsTable;
