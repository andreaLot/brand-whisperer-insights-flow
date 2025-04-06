
import React from 'react';
import { motion } from 'framer-motion';
import { BusinessCategory } from "@/services/types";
import CategoryDetectionPanel from '../CategoryDetectionPanel';

interface CategoryDetectionPanelWrapperProps {
  suggestedCategories: BusinessCategory[];
  apifyLoading: boolean;
  animationProps: any;
}

const CategoryDetectionPanelWrapper: React.FC<CategoryDetectionPanelWrapperProps> = ({ 
  suggestedCategories, 
  apifyLoading,
  animationProps 
}) => {
  return (
    <motion.div
      key="category"
      {...animationProps}
    >
      <CategoryDetectionPanel 
        suggestedCategories={suggestedCategories}
        apifyLoading={apifyLoading}
      />
    </motion.div>
  );
};

export default CategoryDetectionPanelWrapper;
