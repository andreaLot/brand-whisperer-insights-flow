
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { AnalysisResult } from "@/services/AnalysisService";
import ResultsHeader from "./components/ResultsHeader";
import ResultsTabContent from "./components/ResultsTabContent";
import SummaryTabContent from "./components/SummaryTabContent";

interface ResultsStepProps {
  analysisResult: AnalysisResult;
  onStartOver: () => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ analysisResult, onStartOver }) => {
  const [activeTab, setActiveTab] = useState("results");
  
  useEffect(() => {
    console.log("ResultsStep received analysisResult:", analysisResult);
    console.log("Platform results:", analysisResult.platformResults);
  }, [analysisResult]);
  
  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <ResultsHeader 
        businessName={analysisResult.businessName}
        location={analysisResult.location}
        category={analysisResult.category}
        model={analysisResult.model}
        overallScore={analysisResult.overallScore}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onStartOver={onStartOver}
      />

      <AnimatePresence mode="wait">
        {activeTab === "results" ? (
          <ResultsTabContent platformResults={analysisResult.platformResults || []} />
        ) : (
          <SummaryTabContent
            overallScore={analysisResult.overallScore} 
            strengths={analysisResult.strengths} 
            weaknesses={analysisResult.weaknesses} 
            recommendations={analysisResult.recommendations} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ResultsStep;
