
import React from 'react';
import ResultsStep from './ResultsStep';
import LocationSelector from '@/components/LocationSelector';
import { AnalysisResult, BusinessCategory } from "@/services/AnalysisService";

type Step = 'welcome' | 'business-name' | 'category-detection' | 'analyzing' | 'results';

interface InputPanelProps {
  step: Step;
  businessName: string;
  analysisResult: AnalysisResult | null;
  suggestedCategories: BusinessCategory[];
  setBusinessName: (name: string) => void;
  handleBusinessNameSubmit: () => void;
  handleLocationSelect: (location: string) => void;
  handleStartOver: () => void;
}

const InputPanel: React.FC<InputPanelProps> = ({
  step,
  businessName,
  analysisResult,
  suggestedCategories,
  setBusinessName,
  handleBusinessNameSubmit,
  handleLocationSelect,
  handleStartOver
}) => {
  return (
    <div className="w-full md:w-1/2">
      {/* Show location selector in the welcome step */}
      {step === 'welcome' && (
        <div className="bg-brand-gray-dark rounded-lg p-6 border border-gray-700 animate-fade-in">
          <h3 className="text-lg font-medium mb-4">Enter a location to analyze:</h3>
          <LocationSelector onSelect={handleLocationSelect} />
        </div>
      )}
      
      {step === 'category-detection' && suggestedCategories.length > 0 && (
        <div className="bg-brand-gray-dark rounded-lg p-6 border border-gray-700 animate-fade-in">
          <h3 className="text-lg font-medium mb-4">Detected Categories:</h3>
          <ul className="space-y-2">
            {suggestedCategories.map((cat, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>{cat.name}</span>
                <span className="text-sm text-gray-400">
                  {Math.round(cat.confidence * 100)}% confidence
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {step === 'results' && analysisResult && (
        <ResultsStep
          analysisResult={analysisResult}
          onStartOver={handleStartOver}
        />
      )}
    </div>
  );
};

export default InputPanel;
