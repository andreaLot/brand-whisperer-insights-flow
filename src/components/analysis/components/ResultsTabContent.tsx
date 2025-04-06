
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import ResultCard from "@/components/ResultCard";
import PlatformIcon from "../panels/chatbot/ratings/PlatformIcon";
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
  
  useEffect(() => {
    // Animate cards one by one
    platformResults.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards(prev => [...prev, index]);
      }, 600 + (index * 300)); // 300ms delay between each card
    });
  }, [platformResults.length]);

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
          {platformResults.map((result, index) => (
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
