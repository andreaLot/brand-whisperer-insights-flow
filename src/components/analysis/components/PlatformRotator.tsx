
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";

interface Platform {
  name: string;
  color: string;
}

interface PlatformRotatorProps {
  platforms: Platform[];
  isComplete: boolean;
}

const PlatformRotator: React.FC<PlatformRotatorProps> = ({ platforms, isComplete }) => {
  const [currentPlatformIndex, setCurrentPlatformIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Handle platform rotation with fade effect
  useEffect(() => {
    // If analysis is complete, don't start the platform rotation
    if (isComplete) return;

    const fadeInterval = setInterval(() => {
      setIsVisible(false);
      
      // Wait for fade out, then change platform and fade in
      setTimeout(() => {
        setCurrentPlatformIndex(prevIndex => (prevIndex + 1) % platforms.length);
        setIsVisible(true);
      }, 600);
    }, 3500); // Increased rotation time from 2000ms to 3500ms to slow down the interchange

    return () => clearInterval(fadeInterval);
  }, [platforms.length, isComplete]);

  return (
    <AnimatePresence mode="wait">
      <motion.p 
        key={platforms[currentPlatformIndex].name}
        className="text-3xl text-center font-medium mt-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 5 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <span 
          style={{ 
            color: platforms[currentPlatformIndex].color,
            textShadow: `0 0 15px ${platforms[currentPlatformIndex].color}40`
          }} 
          className="font-bold text-4xl"
        >
          {platforms[currentPlatformIndex].name}
        </span>
      </motion.p>
    </AnimatePresence>
  );
};

export default PlatformRotator;
