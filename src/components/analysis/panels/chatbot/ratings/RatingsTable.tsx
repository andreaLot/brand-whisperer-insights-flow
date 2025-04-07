
import React from 'react';
import RatingsTableContainer from './RatingsTableContainer';

interface PlatformResult {
  platform?: string;
  model?: string;
  score: number;
  rank?: number;
}

interface RatingsTableProps {
  businessName: string;
  platformResults: PlatformResult[];
}

const RatingsTable: React.FC<RatingsTableProps> = ({ businessName, platformResults }) => {
  return (
    <RatingsTableContainer 
      businessName={businessName}
      platformResults={platformResults}
    />
  );
};

export default RatingsTable;
