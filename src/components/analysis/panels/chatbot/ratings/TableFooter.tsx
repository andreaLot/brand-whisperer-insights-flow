
import React from 'react';
import { motion } from 'framer-motion';

interface TableFooterProps {
  businessName: string;
}

const TableFooter: React.FC<TableFooterProps> = ({ businessName }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="text-center text-sm text-white mt-6"
    >
      Analysis for <span className="text-white font-medium">{businessName}</span> across major AI platforms. 
      <br />Higher scores indicate better visibility and representation in AI responses.
    </motion.div>
  );
};

export default TableFooter;
