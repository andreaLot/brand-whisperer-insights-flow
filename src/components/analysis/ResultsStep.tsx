
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import ResultCard from "@/components/ResultCard";
import SummaryBox from "@/components/SummaryBox";
import { AnalysisResult } from "@/services/AnalysisService";
import { Search, MessageSquare, BarChart2, ArrowRightCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
    }, 800);
    
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
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">
            Analysis for <span className="text-brand-blue-light">{analysisResult.businessName}</span>
          </h2>
          <Button onClick={onStartOver} variant="outline" size="sm" className="flex items-center gap-1.5">
            <ArrowRightCircle size={15} />
            New Analysis
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="bg-gray-800/50 p-2.5 rounded-lg border border-gray-700 flex items-center justify-center">
            <span className="text-gray-400 mr-1.5">Location:</span>
            <span className="font-medium">{analysisResult.location}</span>
          </div>
          <div className="bg-gray-800/50 p-2.5 rounded-lg border border-gray-700 flex items-center justify-center">
            <span className="text-gray-400 mr-1.5">Category:</span>
            <span className="font-medium">{analysisResult.category}</span>
          </div>
          <div className="bg-gray-800/50 p-2.5 rounded-lg border border-gray-700 flex items-center justify-center">
            <span className="text-gray-400 mr-1.5">Score:</span>
            <span className="font-medium">{analysisResult.overallScore}/100</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 border-b border-gray-700 mb-4">
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
        </div>
      </div>

      {activeTab === "results" ? (
        <div className="space-y-6">
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {analysisResult.platformResults.map((result, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ResultCard 
                      key={index} 
                      platform={result.platform} 
                      score={result.score} 
                      rank={result.rank} 
                      icon={renderPlatformIcon(result.platform)} 
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
        </div>
      ) : (
        showSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SummaryBox 
              overallScore={analysisResult.overallScore} 
              strengths={analysisResult.strengths} 
              weaknesses={analysisResult.weaknesses} 
              recommendations={analysisResult.recommendations} 
            />
          </motion.div>
        )
      )}
    </motion.div>
  );
};

export default ResultsStep;
