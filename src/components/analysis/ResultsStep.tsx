
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import ResultCard from "@/components/ResultCard";
import SummaryBox from "@/components/SummaryBox";
import { AnalysisResult } from "@/services/AnalysisService";
import { Search, MessageSquare, BarChart2, ArrowRightCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ResultsStepProps {
  analysisResult: AnalysisResult;
  onStartOver: () => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ analysisResult, onStartOver }) => {
  const [activeTab, setActiveTab] = useState("results");
  const [showSummary, setShowSummary] = useState(false);
  
  useEffect(() => {
    // Show summary with slight delay for animation effect
    const timer = setTimeout(() => {
      setShowSummary(true);
    }, 400); // Reduced delay for smoother experience
    
    return () => clearTimeout(timer);
  }, []);

  // Render platform icon based on name
  const renderPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'perplexity':
        return <Search size={16} className="text-purple-400" />;
      case 'gemini':
        return <MessageSquare size={16} className="text-blue-400" />;
      case 'grok':
        return <BarChart2 size={16} className="text-red-400" />;
      case 'searchgpt':
        return <Search size={16} className="text-green-400" />;
      case 'gpt-4o':
      case 'gpt-4o-2024-08-06':
        return <MessageSquare size={16} className="text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div 
        className="space-y-4"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <motion.h2 
            className="text-xl font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            Analysis for <span className="text-brand-blue-light">{analysisResult.businessName}</span>
          </motion.h2>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Button onClick={onStartOver} variant="outline" size="sm" className="flex items-center gap-1.5">
              <ArrowRightCircle size={15} />
              New Analysis
            </Button>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 text-xs">
          {["location", "category", "score"].map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
              className="bg-gray-800/50 p-2.5 rounded-lg border border-gray-700 flex items-center justify-center"
            >
              <span className="text-gray-400 mr-1.5">
                {item.charAt(0).toUpperCase() + item.slice(1)}:
              </span>
              <span className="font-medium">
                {item === "location" && analysisResult.location}
                {item === "category" && (
                  <div className="flex items-center gap-1">
                    {analysisResult.category}
                    {analysisResult.model && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="cursor-help">
                              <Info size={12} className="text-brand-blue-light" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Analysis by {analysisResult.model}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                )}
                {item === "score" && `${analysisResult.overallScore}/100`}
              </span>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="flex items-center space-x-2 border-b border-gray-700 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <button
            onClick={() => setActiveTab("results")}
            className={`px-4 py-2 border-b-2 text-sm transition-all ${
              activeTab === "results" 
                ? "border-brand-blue-light text-brand-blue-light" 
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            Results
          </button>
          <button
            onClick={() => setActiveTab("summary")}
            className={`px-4 py-2 border-b-2 text-sm transition-all ${
              activeTab === "summary" 
                ? "border-brand-blue-light text-brand-blue-light" 
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            Summary
          </button>
        </motion.div>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === "results" ? (
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
                {analysisResult.platformResults.map((result, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5, type: "spring" }}
                    >
                      <ResultCard 
                        key={index} 
                        platform={result.platform} 
                        score={result.score} 
                        rank={result.rank} 
                        icon={renderPlatformIcon(result.platform || result.model)} 
                      />
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-4">
                <CarouselPrevious className="relative static transform-none mx-2" />
                <CarouselNext className="relative static transform-none mx-2" />
              </div>
            </Carousel>
          </motion.div>
        ) : (
          <motion.div
            key="summary"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
          >
            {showSummary && (
              <SummaryBox 
                overallScore={analysisResult.overallScore} 
                strengths={analysisResult.strengths} 
                weaknesses={analysisResult.weaknesses} 
                recommendations={analysisResult.recommendations} 
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ResultsStep;
