
import React from 'react';
import { Button } from "@/components/ui/button";
import ResultCard from "@/components/ResultCard";
import SummaryBox from "@/components/SummaryBox";
import { AnalysisResult } from "@/services/AnalysisService";
import { Search, MessageSquare, BarChart2 } from "lucide-react";

interface ResultsStepProps {
  analysisResult: AnalysisResult;
  onStartOver: () => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ analysisResult, onStartOver }) => {
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
    <>
      <div className="space-y-6">
        <h2 className="text-xl font-normal">
          Analysis Complete for <span className="text-brand-blue-light">{analysisResult.businessName}</span>
        </h2>
        <div className="space-y-1 text-sm">
          <p>
            <span className="text-gray-400">Location:</span> {analysisResult.location}
          </p>
          <p>
            <span className="text-gray-400">Category:</span> {analysisResult.category}
          </p>
          <p>
            <span className="text-gray-400">Overall Score:</span> {analysisResult.overallScore}/100
          </p>
        </div>
        <Button onClick={onStartOver} variant="dynamic" size="xl" className="mt-4">
          Start New Analysis
        </Button>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {analysisResult.platformResults.map((result, index) => (
            <ResultCard 
              key={index} 
              platform={result.platform} 
              score={result.score} 
              rank={result.rank} 
              icon={renderPlatformIcon(result.platform)} 
            />
          ))}
        </div>
        
        <SummaryBox 
          overallScore={analysisResult.overallScore} 
          strengths={analysisResult.strengths} 
          weaknesses={analysisResult.weaknesses} 
          recommendations={analysisResult.recommendations} 
        />
      </div>
    </>
  );
};

export default ResultsStep;
