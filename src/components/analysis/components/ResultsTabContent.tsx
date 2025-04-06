
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import ResultCard from "@/components/ResultCard";
import { Search, MessageSquare, BarChart2, Shield } from "lucide-react";
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
  
  // Render platform icon based on name
  const renderPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'perplexity':
        return <Search size={16} className="text-white" />;
      case 'gemini':
        return <MessageSquare size={16} className="text-white" />;
      case 'deepseek':
        return <Shield size={16} className="text-white" />;
      case 'mistral':
        return <BarChart2 size={16} className="text-white" />;
      case 'gpt-4o':
      case 'gpt-4o-2024-08-06':
      case 'openai':
        return <MessageSquare size={16} className="text-white" />;
      default:
        return null;
    }
  };

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
                      platform={result.platform} 
                      score={result.score} 
                      rank={result.rank} 
                      icon={renderPlatformIcon(result.platform || result.model)} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center mt-4">
          <CarouselPrevious className="relative static transform-none mx-2" />
          <CarouselNext className="relative static transform-none mx-2" />
        </div>
      </Carousel>
    </motion.div>
  );
};

export default ResultsTabContent;
