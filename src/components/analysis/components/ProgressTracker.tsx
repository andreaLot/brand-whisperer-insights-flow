
import React, { useState, useEffect } from 'react';

interface ProgressTrackerProps {
  onComplete: () => void;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  // Handle progress and completion
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + 0.5;
        
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setIsComplete(true);
          return 100;
        }
        
        return newProgress;
      });
    }, 150); // Slower progress to give time for the animation
    
    return () => clearInterval(progressInterval);
  }, []);
  
  // Handle completion
  useEffect(() => {
    if (isComplete && onComplete) {
      // Wait a moment before triggering completion for smoother transition
      const timeout = setTimeout(() => {
        onComplete();
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [isComplete, onComplete]);

  return { progress, isComplete };
};

export default ProgressTracker;
