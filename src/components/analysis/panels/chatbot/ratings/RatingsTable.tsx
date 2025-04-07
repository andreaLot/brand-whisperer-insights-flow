
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
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Important: Make sure we have an array, even if empty
  const results = Array.isArray(platformResults) ? platformResults : [];
  const hasResults = results.length > 0;
  
  useEffect(() => {
    if (hasInitialized) return; // Prevent multiple initializations
    
    console.log("🎯 [RatingsTable] Received platformResults:", JSON.stringify(results, null, 2));
    console.log(`🎯 [RatingsTable] Number of platform results: ${results.length}`);
    
    // Set has initialized to prevent multiple animations
    setHasInitialized(true);
    
    // Only animate if we have actual results
    if (hasResults) {
      // Start animations sequence
      startAnimations(results);
    }
  }, [platformResults, hasResults]);
  
  const startAnimations = (results: PlatformResult[]) => {
    // First show the card container
    setCardVisible(true);
    
    // Then show the title with a small delay
    setTimeout(() => setTitleVisible(true), 300);
    
    // Start showing rows one by one
    results.forEach((_, index) => {
      setTimeout(() => {
        setVisibleRows(prev => [...prev, index]);
      }, 600 + (index * 200)); // Faster animation sequence
    });
    
    // Finally show the legend and footer
    setTimeout(() => setLegendVisible(true), 600 + (results.length * 200) + 200);
    setTimeout(() => setFooterVisible(true), 600 + (results.length * 200) + 400);
  };

  // If we have no results, don't render anything
  if (!hasResults) {
    return null;
  }

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
                    results={results} 
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
                platformCount={results.length}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RatingsTable;
