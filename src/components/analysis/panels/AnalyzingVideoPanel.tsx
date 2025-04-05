
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AnalyzingVideoPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Delay the appearance of the video for a more dynamic transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 800);
    
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
          duration: 0.8, 
          ease: "easeOut"
        }}
        className="aspect-video relative w-full h-full rounded-xl overflow-hidden"
      >
        {isVisible && (
          <iframe 
            src="https://share.synthesia.io/embeds/videos/9081a83c-bb4a-4314-ae81-f3e227152744" 
            loading="eager" 
            title="Synthesia video player - Boost Your AI Search Visibility: The Power of Updated Directories" 
            allowFullScreen 
            allow="encrypted-media; fullscreen;" 
            className="absolute inset-0 w-full h-full border-0 rounded-xl"
          />
        )}
      </motion.div>
    </div>
  );
};

export default AnalyzingVideoPanel;
