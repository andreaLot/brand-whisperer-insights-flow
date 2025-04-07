
import React from 'react';
import LocationSelector from '@/components/LocationSelector';
import { PlaceSelectionResult } from '@/hooks/useGooglePlaces';

interface LocationPanelProps {
  handleLocationSelect: (location: string, placeData?: PlaceSelectionResult) => void;
}

const LocationPanel: React.FC<LocationPanelProps> = ({ handleLocationSelect }) => {
  return (
    <div className="bg-brand-gray-dark rounded-lg p-6 border border-gray-700 animate-fade-in">
      <h2 className="text-xl font-normal mb-6">
        Select a{' '}
        <span className="relative inline-block">
          <span className="relative z-10 font-bold text-white">location</span>
          <span className="absolute inset-0 btn-animate rounded-md opacity-90 -z-10"></span>
        </span>{' '}
        to analyze
      </h2>
      <LocationSelector onSelect={handleLocationSelect} />
    </div>
  );
};

export default LocationPanel;
