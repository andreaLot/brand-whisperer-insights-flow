
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AnalyzingVideoPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Delay the appearance of the video for a smoother transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 800); // Wait 800ms before starting to show the video
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="flex items-center justify-center h-full">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
          opacity: isVisible ? 1 : 0, 
          scale: isVisible ? 1 : 0.95 
        }}
        transition={{ 
          duration: 1.2, 
          ease: [0.22, 1, 0.36, 1] // Custom easing for smooth motion
        }}
        style={{ 
          position: 'relative', 
          overflow: 'hidden', 
          width: '100%', 
          borderRadius: '0.5rem',
          zIndex: 10 // Ensure video is above other elements
        }} 
        className="aspect-video shadow-xl"
      >
        {/* Overlay that fades out */}
        <motion.div 
          className="absolute inset-0 bg-brand-black"
          initial={{ opacity: 1 }}
          animate={{ opacity: isVisible ? 0 : 1 }}
          transition={{ duration: 1.5 }}
          style={{ zIndex: 5 }}
        />
        
        <iframe 
          src="https://share.synthesia.io/embeds/videos/9081a83c-bb4a-4314-ae81-f3e227152744" 
          loading="lazy" 
          title="Synthesia video player - Boost Your AI Search Visibility: The Power of Updated Directories" 
          allowFullScreen 
          allow="encrypted-media; fullscreen;" 
          style={{ 
            position: 'absolute', 
            width: '100%', 
            height: '100%', 
            top: 0, 
            left: 0, 
            border: 'none', 
            padding: 0, 
            margin: 0, 
            overflow: 'hidden',
            zIndex: 10 // Ensure iframe content is above any potential interfering elements
          }}
        />
      </motion.div>
    </div>
  );
};

export default AnalyzingVideoPanel;
