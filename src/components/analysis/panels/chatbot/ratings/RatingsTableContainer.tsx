
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import RatingsTableTitle from './RatingsTableTitle';
import RatingsResults from './RatingsResults';
import ScoreLegend from './ScoreLegend';
import TableFooter from './TableFooter';
import RatingsTableEmptyState from './RatingsTableEmptyState';
import { cardVariants } from './RatingsAnimations';
import useRatingsAnimation from './useRatingsAnimation';

interface PlatformResult {
  platform?: string;
  model?: string;
  score: number;
  rank?: number;
}

interface RatingsTableContainerProps {
  businessName: string;
  platformResults: PlatformResult[];
}

const RatingsTableContainer: React.FC<RatingsTableContainerProps> = ({ businessName, platformResults }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Important: Make sure we have an array, even if empty
  const results = Array.isArray(platformResults) ? platformResults : [];
  const hasResults = results.length > 0;
  
  // Use our custom animation hook
  const { 
    visibleRows, 
    cardVisible, 
    titleVisible, 
    legendVisible, 
    footerVisible 
  } = useRatingsAnimation({
    results,
    hasResults
  });

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

export default RatingsTableContainer;
