
import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex space-x-2 my-6">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div 
            className={`h-1.5 w-full rounded-full transition-all duration-500 ${
              index < currentStep 
                ? 'bg-gradient-to-r from-brand-blue to-brand-blue-light' 
                : index === currentStep 
                  ? 'bg-brand-blue-light animate-pulse' 
                  : 'bg-gray-700'
            }`}
          />
          {index === currentStep && (
            <div className="w-1.5 h-1.5 bg-brand-blue-light rounded-full mt-1 animate-pulse" />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressIndicator;
