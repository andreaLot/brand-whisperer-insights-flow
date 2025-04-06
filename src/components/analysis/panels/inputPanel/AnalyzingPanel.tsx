
import React from 'react';
import { motion } from 'framer-motion';
import AnalyzingVideoPanel from '../AnalyzingVideoPanel';

interface AnalyzingPanelProps {
  animationProps: any;
}

const AnalyzingPanel: React.FC<AnalyzingPanelProps> = ({ animationProps }) => {
  return (
    <motion.div
      key="analyzing"
      {...animationProps}
      className="relative z-10"
    >
      <AnalyzingVideoPanel />
    </motion.div>
  );
};

export default AnalyzingPanel;
