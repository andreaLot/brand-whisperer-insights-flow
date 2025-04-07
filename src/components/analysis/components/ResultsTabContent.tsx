
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import ResultCard from "@/components/ResultCard";
import PlatformIcon from "../panels/chatbot/ratings/PlatformIcon";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ResultsTabContentProps {
  platformResults: Array<{
    platform?: string;
    model?: string;
    score: number;
    rank?: number;
  }>;
}

const ResultsTabContent: React.FC<ResultsTabContentProps> = ({ platformResults }) => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Ensure platformResults is always an array
  const results = Array.isArray(platformResults) ? platformResults : [];
  
  useEffect(() => {
    console.log("ResultsTabContent received platformResults:", results);
    
    // Reset visible cards when results change
    setVisibleCards([]);
    
    // Set loading state based on results
    if (results.length > 0) {
      setIsLoading(false);
      
      // Animate cards one by one
      results.forEach((_, index) => {
        setTimeout(() => {
          setVisibleCards(prev => [...prev, index]);
        }, 300 + (index * 200)); // 200ms delay between each card
      });
    } else {
      // Show loading for at least 3 seconds
      const loadingTimer = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      
      return () => clearTimeout(loadingTimer);
    }
  }, [results]);

  if (isLoading) {
    return (
      <motion.div
        key="loading"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center p-8"
      >
        <Loader2 size={40} className="text-violet-400 animate-spin mb-4" />
        <h3 className="text-lg font-medium text-violet-200 mb-2">Loading platform results</h3>
        <p className="text-gray-400 text-sm">Retrieving data from AI platforms...</p>
        
        {/* Loading skeleton cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 w-full">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="bg-violet-900/20 rounded-xl p-4 border border-violet-500/20">
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-8 w-32 bg-violet-500/20" />
                <Skeleton className="h-8 w-8 rounded-full bg-violet-500/20" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-12 w-full bg-violet-500/20" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-16 bg-violet-500/20" />
                  <Skeleton className="h-6 w-12 bg-violet-500/20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (results.length === 0) {
    return (
      <motion.div
        key="no-results"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="p-8 text-center"
      >
        <p className="text-gray-300">No platform results available.</p>
        <p className="text-gray-400 text-sm mt-1">Please complete the analysis process first.</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      key="results"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {results.map((result, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <AnimatePresence>
                {visibleCards.includes(index) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, type: "spring" }}
                  >
                    <ResultCard 
                      platform={result.platform || result.model || ""} 
                      score={result.score} 
                      rank={result.rank} 
                      icon={<PlatformIcon platform={result.platform || result.model} />} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center mt-4">
          <CarouselPrevious className="relative static transform-none mx-2 text-white" />
          <CarouselNext className="relative static transform-none mx-2 text-white" />
        </div>
      </Carousel>
    </motion.div>
  );
};

export default ResultsTabContent;
