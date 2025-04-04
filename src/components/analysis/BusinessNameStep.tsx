
import React from 'react';
import LocationSelector from '@/components/LocationSelector';

interface BusinessNameStepProps {
  handleLocationSelect: (location: string) => void;
}

const BusinessNameStep: React.FC<BusinessNameStepProps> = ({ handleLocationSelect }) => {
  return (
    <div className="space-y-10">
      <h2 className="text-xl font-normal">
        Enter your <span className="text-brand-blue-light">business name</span>
      </h2>
      <p className="text-gray-300 text-sm mb-6">
        We'll use this to find information about your brand across multiple platforms.
      </p>
      
      <h2 className="text-xl font-normal mt-6">
        Select a <span className="text-brand-blue-light">location</span> to analyze
      </h2>
      <p className="text-gray-300 text-sm">
        This helps us analyze your local presence and competition.
      </p>
      
      <div className="mt-4">
        <LocationSelector onSelect={handleLocationSelect} />
      </div>
    </div>
  );
};

export default BusinessNameStep;
