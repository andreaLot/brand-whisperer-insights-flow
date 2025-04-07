
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const [hasInitialized, setHasInitialized] = useState(false);
  
  // Ensure platformResults is always an array
  const results = Array.isArray(platformResults) ? platformResults : [];
  
  useEffect(() => {
    if (hasInitialized) return; // Prevent multiple initializations
    
    console.log("ResultsTabContent received platformResults:", results);
    setHasInitialized(true);
    
    // Skip placeholder data and only show when real results are available
    if (results.length > 0) {
      setIsLoading(false);
      
      // Animate cards one by one
      results.forEach((_, index) => {
        setTimeout(() => {
          setVisibleCards(prev => [...prev, index]);
        }, 300 + (index * 200)); // 200ms delay between each card
      });
    } else {
      setIsLoading(true);
    }
  }, [results, platformResults]);

  if (isLoading || results.length === 0) {
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
      </motion.div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-220px)]">
      <motion.div 
        key="results"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.4 }}
        className="space-y-6 p-2"
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
    </ScrollArea>
  );
};

export default ResultsTabContent;
