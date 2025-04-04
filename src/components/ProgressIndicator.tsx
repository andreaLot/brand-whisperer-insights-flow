
import React from 'react';
import { motion } from "framer-motion";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <motion.div 
      className="flex space-x-2 my-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {Array.from({ length: totalSteps }).map((_, index) => (
        <motion.div 
          key={index} 
          className="flex-1 flex flex-col items-center"
          initial={{ opacity: 0, scaleX: 0.5 }}
          animate={{ 
            opacity: 1, 
            scaleX: 1,
            transition: { delay: index * 0.1, duration: 0.4 }
          }}
        >
          <motion.div 
            className={`h-1.5 w-full rounded-full transition-all duration-300 ${
              index < currentStep 
                ? 'bg-gradient-to-r from-brand-blue to-brand-blue-light' 
                : index === currentStep 
                  ? 'bg-brand-blue-light' 
                  : 'bg-gray-700'
            }`}
            animate={index === currentStep ? {
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.03, 1]
            } : {}}
            transition={index === currentStep ? {
              repeat: Infinity,
              duration: 1.5
            } : {}}
          />
          {index === currentStep && (
            <motion.div 
              className="w-1.5 h-1.5 bg-brand-blue-light rounded-full mt-1"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5,
                ease: "easeInOut" 
              }}
            />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProgressIndicator;
