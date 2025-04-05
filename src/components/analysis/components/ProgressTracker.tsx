
import React, { useState, useEffect } from 'react';

interface ProgressTrackerProps {
  onComplete: () => void;
}

// This was incorrectly returning an object instead of JSX
// Let's convert it to a proper React component that renders progress
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
    if (isComplete) {
      // Wait a moment before triggering completion for smoother transition
      const timeout = setTimeout(() => {
        onComplete();
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [isComplete, onComplete]);

  // Return JSX instead of an object
  return (
    <div className="w-full bg-gray-800 rounded-full h-2.5 mb-4 overflow-hidden">
      <div 
        className="bg-brand-blue h-2.5 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressTracker;
