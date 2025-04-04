
import React, { useState, useEffect } from 'react';
import { Loader2, Search, CheckCircle, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

interface AnalyzingStepProps {
  businessName: string; // Added this prop
  primaryCategory?: string;
  location?: string;
  onAnalysisComplete?: () => void;
}

const AnalyzingStep: React.FC<AnalyzingStepProps> = ({ 
  businessName,
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
          }, 1000); // Reduced delay for smoother transition
          return 100;
        }
        return newProgress;
      });
    }, 80); // Faster speed for more fluid animation
    
    return () => clearInterval(interval);
  }, [onAnalysisComplete, platforms]);

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <motion.h2 
          className="text-xl font-medium mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-brand-blue-light">Analyzing</span> {businessName}'s {categoryText}{locationText}
        </motion.h2>
        <motion.p 
          className="text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          Checking visibility across AI platforms
        </motion.p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Analysis progress</span>
            <motion.span 
              className="font-medium"
              key={progress}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 10 }}
            >
              {progress}%
            </motion.span>
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
            transition={{ duration: 0.5 }}
          >
            {analyzedPlatforms.map((platform, index) => (
              <motion.div
                key={platform}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 500,
                  damping: 25,
                  delay: index * 0.08
                }}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-800/50 border border-gray-700"
              >
                <CheckCircle size={18} className="text-green-500" />
                <span className="text-sm">{platform}</span>
                <span className="text-xs text-green-400 ml-auto">Complete</span>
              </motion.div>
            ))}
            
            {currentPlatform && !analyzedPlatforms.includes(currentPlatform) && (
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 500 }}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-800/50 border border-gray-700"
              >
                <Search size={18} className="text-brand-blue-light animate-pulse" />
                <span className="text-sm">{currentPlatform}</span>
                <motion.div 
                  className="ml-auto flex items-center"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <span className="h-1.5 w-1.5 bg-brand-blue-light rounded-full mr-1"></span>
                  <span className="h-1.5 w-1.5 bg-brand-blue-light rounded-full mr-1 opacity-75"></span>
                  <span className="h-1.5 w-1.5 bg-brand-blue-light rounded-full opacity-50"></span>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AnalyzingStep;
