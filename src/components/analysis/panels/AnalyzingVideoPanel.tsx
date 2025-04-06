
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AnalyzingVideoPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  // Delay the appearance of the video for a more dynamic transition
  useEffect(() => {
    // First make the container visible
    const containerTimer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    // Then show the video with a delay for sequenced animation
    const videoTimer = setTimeout(() => {
      setIsReady(true);
    }, 1000);
    
    return () => {
      clearTimeout(containerTimer);
      clearTimeout(videoTimer);
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <motion.div 
        className="w-full max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div 
          initial={{ 
            scale: 0.85, 
            opacity: 0,
            rotateX: 15,
            y: 50
          }}
          animate={{ 
            scale: isVisible ? 1 : 0.85,
            opacity: isVisible ? 1 : 0,
            rotateX: isVisible ? 0 : 15,
            y: isVisible ? 0 : 50
          }}
          transition={{ 
            duration: 0.8, 
            ease: [0.19, 1.0, 0.22, 1.0], // Expo easing for smoother motion
            delay: 0.2
          }}
          className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl"
          style={{
            boxShadow: '0 20px 80px -10px rgba(0, 82, 204, 0.5)',
            transform: 'perspective(1000px)'
          }}
        >
          {/* Remove the gradient div that was causing the black bar */}
          
          {isVisible && (
            <motion.iframe 
              src="https://share.synthesia.io/embeds/videos/9081a83c-bb4a-4314-ae81-f3e227152744" 
              loading="eager" 
              title="Synthesia video player - Boost Your AI Search Visibility: The Power of Updated Directories" 
              allowFullScreen 
              allow="encrypted-media; fullscreen;" 
              className="absolute inset-0 w-full h-full border-0 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: isReady ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              onLoad={() => setIsReady(true)}
            />
          )}
          
          {!isReady && isVisible && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center bg-brand-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible && !isReady ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
              />
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AnalyzingVideoPanel;
