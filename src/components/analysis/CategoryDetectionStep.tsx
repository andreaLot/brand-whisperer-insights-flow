
import React from 'react';
import { Loader2 } from "lucide-react";
import { BusinessCategory } from "@/services/AnalysisService";
import { motion, AnimatePresence } from "framer-motion";

interface CategoryDetectionStepProps {
  suggestedCategories: BusinessCategory[];
}

const CategoryDetectionStep: React.FC<CategoryDetectionStepProps> = ({ suggestedCategories }) => {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h2 
        className="text-xl font-normal"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Detecting your <span className="text-brand-blue-light">business category</span>
      </motion.h2>
      
      <motion.div 
        className="flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="relative flex">
          <Loader2 className="animate-spin" size={20} />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent to-brand-blue-light/20 rounded-full"
            animate={{ 
              opacity: [0.2, 0.5, 0.2], 
              scale: [0.8, 1.2, 0.8] 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2, 
              ease: "easeInOut" 
            }}
          />
        </div>
        <span className="text-sm">Analyzing business data</span>
      </motion.div>
      
      <AnimatePresence>
        {suggestedCategories.length > 0 && (
          <motion.div 
            className="bg-brand-gray-dark rounded-lg p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
          >
            <motion.h3 
              className="text-lg font-medium mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              Detected Categories:
            </motion.h3>
            <motion.ul 
              className="space-y-2"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1,
                  transition: { 
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {suggestedCategories.map((cat, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-center justify-between"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <span>{cat.name}</span>
                  <span className="text-sm text-gray-400">
                    {Math.round(cat.confidence * 100)}% confidence
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CategoryDetectionStep;
