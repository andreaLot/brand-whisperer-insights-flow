
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import RatingsTableTitle from './RatingsTableTitle';
import RatingsResults from './RatingsResults';
import ScoreLegend from './ScoreLegend';
import TableFooter from './TableFooter';
import RatingsTableEmptyState from './RatingsTableEmptyState';
import { cardVariants } from './RatingsAnimations';

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
  const [hasInitialized, setHasInitialized] = useState(false);

  // Important: Make sure we have an array, even if empty
  const results = Array.isArray(platformResults) ? platformResults : [];
  
  // Always show demo data if there are no real results
  const hasResults = results.length > 0;
  const displayResults = hasResults ? results : [
    { platform: 'Gemini', score: 88, rank: 2 },
    { platform: 'GPT-4o', score: 92, rank: 1 },
    { platform: 'Perplexity', score: 85, rank: 3 },
    { platform: 'Claude', score: 84, rank: 4 },
    { platform: 'Mistral', score: 82, rank: 5 },
  ];
  
  useEffect(() => {
    if (hasInitialized) return; // Prevent multiple initializations
    
    console.log("🎯 [RatingsTable] Received platformResults:", JSON.stringify(results, null, 2));
    console.log(`🎯 [RatingsTable] Number of platform results: ${results.length}`);
    
    // Reset animation states
    setVisibleRows([]);
    setCardVisible(false);
    setTitleVisible(false);
    setLegendVisible(false);
    setFooterVisible(false);
    
    // Always show loading initially
    setIsLoading(true);
    setHasInitialized(true);
    
    // Start animations on next tick
    setTimeout(() => {
      startAnimations(displayResults);
    }, 100);
    
    // After 3 seconds, always show results (either real or demo)
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    
    return () => clearTimeout(loadingTimeout);
  }, [platformResults]);
  
  const startAnimations = (results: PlatformResult[]) => {
    // First show the card container
    setCardVisible(true);
    
    // Then show the title
    setTimeout(() => setTitleVisible(true), 500);
    
    // Only start animating rows if loading is complete
    if (!isLoading) {
      results.forEach((_, index) => {
        setTimeout(() => {
          setVisibleRows(prev => [...prev, index]);
        }, 1000 + (index * 300)); // 300ms delay between each row
      });
      
      // Finally show the legend and footer
      setTimeout(() => setLegendVisible(true), 1000 + (results.length * 300) + 300);
      setTimeout(() => setFooterVisible(true), 1000 + (results.length * 300) + 600);
    }
  };

  // Update animations when loading state changes
  useEffect(() => {
    if (!isLoading) {
      displayResults.forEach((_, index) => {
        setTimeout(() => {
          setVisibleRows(prev => [...prev, index]);
        }, 300 + (index * 300)); // 300ms delay between each row
      });
      
      // Show the legend and footer
      setTimeout(() => setLegendVisible(true), 300 + (displayResults.length * 300) + 300);
      setTimeout(() => setFooterVisible(true), 300 + (displayResults.length * 300) + 600);
    }
  }, [isLoading, displayResults.length]);

  return (
    <AnimatePresence>
      {cardVisible && (
        <motion.div 
          className="space-y-6"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="border-violet-500/20 bg-violet-900/10 backdrop-blur-sm shadow-lg shadow-violet-900/10">
            <CardHeader className="pb-3">
              <AnimatePresence>
                {titleVisible && <RatingsTableTitle isLoading={isLoading} />}
              </AnimatePresence>
            </CardHeader>
            <CardContent>
              <div className="relative rounded-xl overflow-hidden border border-violet-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/10 pointer-events-none" />
                
                {isLoading ? (
                  <RatingsTableEmptyState isLoading={isLoading} />
                ) : (
                  <RatingsResults 
                    results={displayResults} 
                    visibleRows={visibleRows} 
                  />
                )}
              </div>
              
              {/* Score legend */}
              <AnimatePresence>
                {legendVisible && !isLoading && <ScoreLegend />}
              </AnimatePresence>
            </CardContent>
          </Card>
          
          <AnimatePresence>
            {footerVisible && !isLoading && (
              <TableFooter 
                businessName={businessName} 
                platformCount={displayResults.length}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RatingsTable;
