
import React from 'react';
import { motion } from 'framer-motion';
import { PlaceSelectionResult } from '@/hooks/useGooglePlaces';
import LocationPanel from '../LocationPanel';

interface WelcomePanelProps {
  handleLocationSelect: (location: string, placeData?: PlaceSelectionResult) => void;
  animationProps: any;
}

const WelcomePanel: React.FC<WelcomePanelProps> = ({ 
  handleLocationSelect, 
  animationProps 
}) => {
  return (
    <motion.div
      key="welcome"
      {...animationProps}
    >
      <LocationPanel handleLocationSelect={handleLocationSelect} />
    </motion.div>
  );
};

export default WelcomePanel;
