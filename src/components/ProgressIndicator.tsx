
import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex space-x-1.5 my-4">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div 
          key={index} 
          className={`h-1.5 rounded-full transition-all duration-300 ${
            index < currentStep 
              ? 'bg-brand-blue w-8' 
              : index === currentStep 
                ? 'bg-brand-blue-light w-8' 
                : 'bg-gray-600 w-4'
          }`}
        />
      ))}
    </div>
  );
};

export default ProgressIndicator;
