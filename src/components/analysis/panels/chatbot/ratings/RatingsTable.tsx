
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

  // Important: Make sure we have an array, even if empty
  const results = Array.isArray(platformResults) ? platformResults : [];
  
  // If there are no real results, don't use demo data
  const hasResults = results.length > 0;
  const displayResults = hasResults ? results : [];
  
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
      // Show loading state for at least 5 seconds if no results
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
                
                {displayResults.length > 0 ? (
                  <RatingsResults 
                    results={displayResults} 
                    visibleRows={visibleRows} 
                  />
                ) : (
                  <RatingsTableEmptyState isLoading={isLoading} />
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
                platformCount={hasResults ? displayResults.length : 0}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RatingsTable;
