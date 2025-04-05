
import React from 'react';
import LocationSelector from '@/components/LocationSelector';
import { PlaceSelectionResult } from '@/hooks/useGooglePlaces';

interface LocationPanelProps {
  handleLocationSelect: (location: string, placeData?: PlaceSelectionResult) => void;
}

const LocationPanel: React.FC<LocationPanelProps> = ({ handleLocationSelect }) => {
  return (
    <div className="bg-brand-gray-dark rounded-lg p-6 border border-gray-700 animate-fade-in">
      <LocationSelector onSelect={handleLocationSelect} />
    </div>
  );
};

export default LocationPanel;
