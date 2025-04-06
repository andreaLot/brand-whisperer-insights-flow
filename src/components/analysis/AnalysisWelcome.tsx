
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";

interface AnalysisWelcomeProps {
  onBeginAnalysis: () => void;
}

const AnalysisWelcome: React.FC<AnalysisWelcomeProps> = ({
  onBeginAnalysis
}) => {
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
        <span className="font-bold">Let's get started!</span>
        <br />
        <br />
        <span className="text-2xl">Simply enter your <motion.span 
          className="text-violet-500 font-tiempos font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >business name</motion.span> and <motion.span 
          className="text-brand-blue-light font-tiempos font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.7 }}
        >select a location</motion.span> you'd like to analyze</span><span className="typewriter-cursor"></span>
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
