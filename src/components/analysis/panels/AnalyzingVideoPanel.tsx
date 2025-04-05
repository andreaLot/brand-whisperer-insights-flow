
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AnalyzingVideoPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Delay the appearance of the video for a more dynamic transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1200); // Increased delay to 1.2s for a more dramatic entrance
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="flex items-center justify-center h-full">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ 
          opacity: isVisible ? 1 : 0, 
          scale: isVisible ? 1 : 0.9,
          y: isVisible ? 0 : 20
        }}
        transition={{ 
          duration: 1.8, // Longer animation duration
          ease: [0.34, 1.56, 0.64, 1], // Custom spring-like easing
          staggerChildren: 0.1 // Stagger child animations
        }}
        className="aspect-video relative w-full h-full rounded-xl overflow-hidden"
        style={{
          zIndex: 10, // Higher z-index to appear above the dropdown
          boxShadow: isVisible ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none'
        }}
      >
        {/* Extended white overlay to cover any lines at the top - full width */}
        <div 
          className="absolute top-0 left-0 w-full z-20" 
          style={{ 
            height: '22px', // Slightly increased height to ensure full coverage
            background: '#fff'
          }}
        />
        
        {/* Only render iframe when it's ready to be visible */}
        {isVisible && (
          <iframe 
            src="https://share.synthesia.io/embeds/videos/9081a83c-bb4a-4314-ae81-f3e227152744" 
            loading="eager" 
            title="Synthesia video player - Boost Your AI Search Visibility: The Power of Updated Directories" 
            allowFullScreen 
            allow="encrypted-media; fullscreen;" 
            className="absolute inset-0 w-full h-full border-0 rounded-xl"
            style={{ 
              padding: 0, 
              margin: 0, 
              overflow: 'hidden',
              zIndex: 10
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default AnalyzingVideoPanel;
