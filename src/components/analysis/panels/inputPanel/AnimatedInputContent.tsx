
import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedInputContentProps {
  children: React.ReactNode;
}

const AnimatedInputContent: React.FC<AnimatedInputContentProps> = ({ children }) => {
  // Animation variants
  const panelVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: [0.19, 1.0, 0.22, 1.0] }
    },
    exit: { 
      opacity: 0, 
      x: 20, 
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      key="input-content"
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedInputContent;
