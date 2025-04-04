
import React from 'react';
import { Loader2 } from "lucide-react";
import { BusinessCategory } from "@/services/AnalysisService";

interface CategoryDetectionStepProps {
  suggestedCategories: BusinessCategory[];
}

const CategoryDetectionStep: React.FC<CategoryDetectionStepProps> = ({ suggestedCategories }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-normal">
        Detecting your <span className="text-brand-blue-light">business category</span>...
      </h2>
      <div className="flex items-center gap-2">
        <Loader2 className="animate-spin" size={20} />
        <span className="text-sm">Analyzing your business name</span>
      </div>
      
      {suggestedCategories.length > 0 && (
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
    </div>
  );
};

export default CategoryDetectionStep;
