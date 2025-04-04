
import React, { useState, useEffect } from 'react';
import { Loader2 } from "lucide-react";

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
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    "Checking Perplexity results",
    "Checking Gemini insights",
    "Analyzing Grok data",
    "Gathering SearchGPT results"
  ];

  useEffect(() => {
    // Longer loading time for each step (2.5 seconds per step)
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        // When all steps are complete, trigger the completion callback
        if (prev === steps.length - 1) {
          clearInterval(interval);
          // Delay the completion callback by 2 seconds to show all steps completed
          setTimeout(() => {
            if (onAnalysisComplete) {
              onAnalysisComplete();
            }
          }, 2000);
          return prev;
        }
        return prev + 1;
      });
    }, 2500);

    // Initial 10-second delay before starting the step-by-step process
    const initialTimer = setTimeout(() => {
      setCurrentStep(0);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, [onAnalysisComplete, steps.length]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-normal">
        Analyzing your presence across <span className="text-brand-blue-light">multiple platforms</span>...
      </h2>
      <p className="text-sm mb-4">
        We will now run a research on Perplexity, Gemini, OpenAI, and Grok to see how visible
        you are in AI Search for {categoryText}{locationText}.
      </p>
      <div className="space-y-3 mt-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-2">
            {index <= currentStep ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <div className="w-4 h-4 ml-1"></div>
            )}
            <span className={`text-sm ${index <= currentStep ? 'text-white' : 'text-gray-500'}`}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyzingStep;
