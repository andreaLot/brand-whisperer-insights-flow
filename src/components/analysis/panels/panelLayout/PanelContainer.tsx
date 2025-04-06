
import React from 'react';
import { motion } from 'framer-motion';

interface PanelContainerProps {
  width: string;
  children: React.ReactNode;
  transitionDuration?: number;
  transitionEase?: string[];
}

const PanelContainer: React.FC<PanelContainerProps> = ({ 
  width, 
  children, 
  transitionDuration = 0.8, 
  transitionEase = [0.19, 1.0, 0.22, 1.0] 
}) => {
  return (
    <motion.div 
      className="flex flex-col gap-6"
      style={{ width }}
      transition={{ 
        duration: transitionDuration, 
        ease: transitionEase 
      }}
    >
      {children}
    </motion.div>
  );
};

export default PanelContainer;
