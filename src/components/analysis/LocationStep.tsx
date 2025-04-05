
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LocationStep: React.FC = () => {
  const [visibleText, setVisibleText] = useState<string[]>([]);
  const text = "Select a location you'd like to analyze";
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const textArray = text.split('');
    let currentIndex = 0;
    
    // Reset the state when the component mounts
    setVisibleText([]);
    setIsComplete(false);
    
    const intervalId = setInterval(() => {
      if (currentIndex < textArray.length) {
        setVisibleText(prev => [...prev, textArray[currentIndex]]);
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(intervalId);
      }
    }, 40); // Adjust speed as needed
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="space-y-10">
      <h2 className="text-xl font-normal">
        {visibleText.map((letter, index) => {
          // Special styling for the word "location"
          const isLocationPart = text.indexOf("location") <= index && 
                                index < text.indexOf("location") + "location".length;
          
          return (
            <motion.span
              key={`${letter}-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.03 // Stagger the animation
              }}
              className={isLocationPart ? "text-brand-blue-light" : ""}
            >
              {letter}
            </motion.span>
          );
        })}
        {!isComplete && <span className="typewriter-cursor"></span>}
      </h2>
      <motion.p 
        className="text-gray-300 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: isComplete ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        This helps us analyze your local presence and competition.
      </motion.p>
    </div>
  );
};

export default LocationStep;
