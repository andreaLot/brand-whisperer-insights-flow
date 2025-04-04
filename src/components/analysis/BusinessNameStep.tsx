
import React from 'react';
import LocationSelector from '@/components/LocationSelector';
import { PlaceSelectionResult } from '@/hooks/useGooglePlaces';

interface BusinessNameStepProps {
  handleLocationSelect: (location: string, placeData?: PlaceSelectionResult, apifyResult?: any) => void;
}

const BusinessNameStep: React.FC<BusinessNameStepProps> = ({ handleLocationSelect }) => {
  const handleSelect = (location: string, placeData?: PlaceSelectionResult, apifyResult?: any) => {
    handleLocationSelect(location, placeData, apifyResult);
  };

  return (
    <div className="space-y-10">
      <h2 className="text-xl font-normal">
        Select a <span className="text-brand-blue-light">location</span> to analyze
      </h2>
      <p className="text-gray-300 text-sm">
        This helps us analyze your local presence and competition.
      </p>
      
      <div className="mt-4">
        <LocationSelector onSelect={handleSelect} />
      </div>
    </div>
  );
};

export default BusinessNameStep;
