
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";

interface AnalysisWelcomeProps {
  onBeginAnalysis: () => void;
}

const AnalysisWelcome: React.FC<AnalysisWelcomeProps> = ({
  onBeginAnalysis
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentPart, setCurrentPart] = useState(0);
  
  const textParts = [
    "Let's get started!",
    "\n\n",
    "Simply enter your ",
    "business name",
    " and ",
    "select a location",
    " you'd like to analyze"
  ];

  useEffect(() => {
    if (currentPart >= textParts.length) return;
    
    let timer: NodeJS.Timeout;
    const currentText = textParts[currentPart];
    let charIndex = 0;
    
    // Different timing for different parts
    const charDelay = currentPart === 0 ? 80 : // Slower for main title
                     (currentPart === 1 ? 0 : // Instant for line breaks
                     (currentPart === 3 || currentPart === 5 ? 60 : 40)); // Different speeds
    
    // Transition to next part when current part is done typing
    const typingInterval = setInterval(() => {
      if (charIndex < currentText.length) {
        setDisplayedText(prev => prev + currentText[charIndex]);
        charIndex++;
      } else {
        clearInterval(typingInterval);
        
        // Delay before starting the next part
        const nextPartDelay = currentPart === 0 ? 400 : 
                             (currentPart === 1 ? 100 : 100);
        
        timer = setTimeout(() => {
          setCurrentPart(prev => prev + 1);
        }, nextPartDelay);
      }
    }, charDelay);
    
    return () => {
      clearInterval(typingInterval);
      if (timer) clearTimeout(timer);
    };
  }, [currentPart]);

  return (
    <motion.div 
      className="h-full flex flex-col justify-between"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <motion.h2 
        className="font-IBM-plex-sans text-3xl font-light"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        {currentPart >= 1 && (
          <span className="font-bold">{textParts[0]}</span>
        )}
        {currentPart < 1 && (
          <span className="font-bold">{displayedText}</span>
        )}
        
        {currentPart >= 3 && (
          <>
            <br />
            <br />
            <span className="text-2xl">
              {textParts[2]}
              <motion.span 
                className="text-violet-500 font-tiempos font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.7 }}
              >
                {textParts[3]}
              </motion.span>
              
              {currentPart >= 5 && (
                <>
                  {textParts[4]}
                  <motion.span 
                    className="text-brand-blue-light font-tiempos font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.7 }}
                  >
                    {textParts[5]}
                  </motion.span>
                </>
              )}
              
              {currentPart >= 6 && textParts[6]}
            </span>
          </>
        )}
        
        {(currentPart > 0 && currentPart < 3) && (
          <>
            <br />
            <br />
            <span className="text-2xl">{displayedText}</span>
          </>
        )}
        {currentPart >= 3 && currentPart < textParts.length && (
          <span className="typewriter-cursor">|</span>
        )}
        {currentPart >= textParts.length && (
          <span className="typewriter-cursor animate-blink">|</span>
        )}
      </motion.h2>
      
      <motion.div 
        className="mt-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <Button 
          onClick={onBeginAnalysis} 
          variant="dynamic" 
          size="xl" 
          className="w-full md:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
        >
          Begin Analysis
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default AnalysisWelcome;
