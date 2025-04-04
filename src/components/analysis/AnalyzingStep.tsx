
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
  const [currentText, setCurrentText] = useState("");
  const [platformIndex, setPlatformIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const platforms = ["Perplexity", "OpenAI", "Gemini", "Grok"];

  // Initial text that appears character by character
  const baseText = `Analyzing your presence across multiple platforms...

We will now run a research to see how visible you are in AI Search for ${categoryText}${locationText}.`;

  // Function to simulate typing effect
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let currentIndex = 0;
    
    const typeNextCharacter = () => {
      if (currentIndex < baseText.length) {
        setCurrentText(baseText.substring(0, currentIndex + 1));
        currentIndex++;
        timeout = setTimeout(typeNextCharacter, 50); // Adjust speed here (50ms per character)
      } else {
        // Base text is complete, start platform sequence after a delay
        setTimeout(() => {
          setShowLoader(true);
          cycleSearchPlatforms();
        }, 1000);
      }
    };
    
    // Start typing after initial delay
    timeout = setTimeout(typeNextCharacter, 1000);
    
    return () => clearTimeout(timeout);
  }, [baseText]);

  // Function to cycle through search platforms
  const cycleSearchPlatforms = () => {
    let currentPlatformIndex = 0;
    
    const updateSearchText = () => {
      setCurrentText(prev => {
        // Remove any existing platform text first
        let baseTextOnly = prev;
        platforms.forEach(platform => {
          baseTextOnly = baseTextOnly.replace(`\n\nSearching on ${platform}...`, "");
        });
        
        // Add the current platform
        return `${baseTextOnly}\n\nSearching on ${platforms[currentPlatformIndex]}...`;
      });
      
      currentPlatformIndex++;
      
      if (currentPlatformIndex < platforms.length) {
        // Continue to the next platform after a delay
        setTimeout(updateSearchText, 3000); // 3 seconds per platform
      } else {
        // All platforms completed
        setTimeout(() => {
          setIsComplete(true);
          if (onAnalysisComplete) {
            setTimeout(() => {
              onAnalysisComplete();
            }, 2000);
          }
        }, 2000);
      }
    };
    
    // Start the platform cycle
    updateSearchText();
  };

  return (
    <div className="space-y-6">
      <div className="min-h-[300px]">
        {/* Display the gradually appearing text */}
        <div className="whitespace-pre-line">{currentText}</div>
        
        {/* Show the loading spinner when appropriate */}
        {showLoader && (
          <div className="mt-6 flex items-center gap-2">
            <Loader2 className="animate-spin" size={16} />
            <span className="text-sm text-brand-blue-light">
              {isComplete ? "Analysis complete" : "Analyzing..."}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyzingStep;
