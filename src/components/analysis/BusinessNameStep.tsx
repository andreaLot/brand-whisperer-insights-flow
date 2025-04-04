
import React from 'react';

const BusinessNameStep: React.FC = () => {
  return (
    <div className="space-y-10">
      <h2 className="text-xl font-normal">
        Enter your <span className="text-brand-blue-light">business name</span>
      </h2>
      <p className="text-gray-300 text-sm">
        We'll use this to find information about your brand across multiple platforms.
      </p>
    </div>
  );
};

export default BusinessNameStep;
