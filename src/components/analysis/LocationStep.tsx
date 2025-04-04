
import React from 'react';

const LocationStep: React.FC = () => {
  return (
    <div className="space-y-10">
      <h2 className="text-xl font-normal">
        Select a <span className="text-brand-blue-light">location</span> to analyze<span className="typewriter-cursor"></span>
      </h2>
      <p className="text-gray-300 text-sm">
        Choose a location from the panel on the right to analyze local presence and competition.
      </p>
    </div>
  );
};

export default LocationStep;
