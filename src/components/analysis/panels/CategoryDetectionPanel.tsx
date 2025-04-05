
import React from 'react';
import { BusinessCategory } from "@/services/AnalysisService";
import { Loader2 } from 'lucide-react';

interface CategoryDetectionPanelProps {
  suggestedCategories: BusinessCategory[];
  apifyLoading: boolean;
}

const CategoryDetectionPanel: React.FC<CategoryDetectionPanelProps> = ({ 
  suggestedCategories, 
  apifyLoading 
}) => {
  return (
    <div className="bg-brand-gray-dark rounded-lg p-6 border border-gray-700 animate-fade-in">
      {apifyLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin text-brand-blue mr-2" />
          <span>Loading business data from Google Places...</span>
        </div>
      ) : (
        <>
          <h3 className="text-lg font-medium mb-4">Detected Categories:</h3>
          {suggestedCategories.length > 0 ? (
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
          ) : (
            <p>Detecting categories...</p>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryDetectionPanel;
