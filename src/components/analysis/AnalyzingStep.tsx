
import React, { useState, useEffect } from 'react';
import { Loader2, Search, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

interface AnalyzingStepProps {
  primaryCategory?: string;
  location?: string;
  onAnalysisComplete?: () => void;
}

const AnalyzingStep: React.FC<AnalyzingStepProps> = ({ 
  primaryCategory, 
  location,
  onAnalysisComplete
}) => {
  const categoryText = primaryCategory || "your business category";
  const locationText = location ? ` in ${location}` : "";
  const [progress, setProgress] = useState(0);
  const [currentPlatform, setCurrentPlatform] = useState("");
  const [analyzedPlatforms, setAnalyzedPlatforms] = useState<string[]>([]);
  const platforms = ["Perplexity", "Gemini", "Grok", "SearchGPT"];
  
  useEffect(() => {
    // Start with initial progress
    setProgress(5);
    
    // Simulate analysis progress with smooth progress bar animation
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + 1;
        
        // Handle platform transitions
        if (newProgress === 25) {
          setCurrentPlatform(platforms[0]);
          setAnalyzedPlatforms(prev => [...prev, platforms[0]]);
        } else if (newProgress === 50) {
          setCurrentPlatform(platforms[1]);
          setAnalyzedPlatforms(prev => [...prev, platforms[1]]);
        } else if (newProgress === 75) {
          setCurrentPlatform(platforms[2]);
          setAnalyzedPlatforms(prev => [...prev, platforms[2]]);
        } else if (newProgress === 90) {
          setCurrentPlatform(platforms[3]);
          setAnalyzedPlatforms(prev => [...prev, platforms[3]]);
        }
        
        // When complete, call the completion handler after a delay
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (onAnalysisComplete) onAnalysisComplete();
          }, 1500);
          return 100;
        }
        return newProgress;
      });
    }, 120); // Speed of analysis simulation
    
    return () => clearInterval(interval);
  }, [onAnalysisComplete, platforms]);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-2">
          <span className="text-brand-blue-light">Analyzing</span> {categoryText}{locationText}
        </h2>
        <p className="text-sm text-gray-400">Checking your visibility across multiple AI platforms</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Analysis progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress 
            value={progress} 
            className="h-2 bg-gray-700"
            style={{ 
              ['--progress-background' as any]: 'linear-gradient(90deg, #0052CC, #4C9AFF)'
            }}
          />
        </div>
        
        <AnimatePresence>
          <motion.div 
            className="space-y-3 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {analyzedPlatforms.map((platform, index) => (
              <motion.div
                key={platform}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-800/50 border border-gray-700"
              >
                <CheckCircle size={18} className="text-green-500" />
                <span className="text-sm">{platform} analysis complete</span>
              </motion.div>
            ))}
            
            {currentPlatform && !analyzedPlatforms.includes(currentPlatform) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-800/50 border border-gray-700"
              >
                <Search size={18} className="text-brand-blue-light animate-pulse" />
                <span className="text-sm">Analyzing {currentPlatform}...</span>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnalyzingStep;
