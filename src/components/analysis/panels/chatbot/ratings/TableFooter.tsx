
import React from 'react';
import { motion } from 'framer-motion';

interface TableFooterProps {
  businessName: string;
  platformCount?: number;
}

const TableFooter: React.FC<TableFooterProps> = ({ 
  businessName,
  platformCount = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="text-center text-sm text-gray-400"
    >
      Higher scores indicate better visibility and representation in AI responses.
    </motion.div>
  );
};

export default TableFooter;
