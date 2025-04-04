import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalysisResult, BusinessCategory, ApifyBusinessResult, ApifyCategoryResult } from "@/services/AnalysisService";
import { Step } from './ConversationPanel';
import { PlaceSelectionResult } from '@/hooks/useGooglePlaces';
import { cn } from "@/lib/utils";
import SearchInput from '@/components/SearchInput';
import LocationSelector from '@/components/LocationSelector';

interface InputPanelProps {
  className?: string;
  step: Step;
  businessName: string;
  analysisResult: AnalysisResult | null;
  suggestedCategories: BusinessCategory[];
  setBusinessName: (name: string) => void;
  handleBusinessNameSubmit: () => void;
  handleLocationSelect: (location: string, placeData?: PlaceSelectionResult) => void;
  handleStartOver: () => void;
  apifyBusinessResult: ApifyBusinessResult | null;
  apifyCategoryResults: ApifyCategoryResult[];
  apifyLoading: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({
  className,
  step,
  businessName,
  analysisResult,
  suggestedCategories,
  setBusinessName,
  handleBusinessNameSubmit,
  handleLocationSelect,
  handleStartOver,
  apifyBusinessResult,
  apifyCategoryResults,
  apifyLoading
}) => {
  return (
    <div className={cn("bg-brand-black-light rounded-lg p-8", className)}>
      <AnimatePresence mode="wait">
        {(step === 'welcome' || step === 'business-name') && (
          <motion.div
            key="location-input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="h-full flex flex-col"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Find Your Perfect Brand Position</h2>
              <p className="text-gray-400">Enter your business location to start the analysis.</p>
            </div>
            <div className="mt-4">
              <LocationSelector onSelect={handleLocationSelect} />
            </div>
          </motion.div>
        )}
        
        {step !== 'welcome' && step !== 'business-name' && (
          <motion.div
            key="analysis-info"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white">{businessName}</h3>
              <p className="text-gray-400 mt-2">
                {location && `Location: ${location}`}
              </p>
            </div>
            
            {/* Add dynamic content based on step here */}
            {step === 'analyzing' && (
              <div className="bg-brand-black-dark p-4 rounded-lg my-4 border border-gray-800">
                <p className="text-sm text-gray-400">Analyzing market position...</p>
              </div>
            )}
            
            {step === 'results' && analysisResult && (
              <div className="space-y-4">
                {/* Results summary could go here */}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InputPanel;
