
import React from 'react';
import InputPanel from './panels/inputPanel/InputPanel';
import { AnalysisResult, BusinessCategory, ApifyBusinessResult } from "@/services/types";
import { PlaceSelectionResult } from '@/hooks/useGooglePlaces';
import { Step } from './ConversationPanel';

interface InputPanelWrapperProps {
  step: Step;
  businessName: string;
  analysisResult: AnalysisResult | null;
  suggestedCategories: BusinessCategory[];
  setBusinessName: (name: string) => void;
  handleBusinessNameSubmit: () => void;
  handleLocationSelect: (location: string, placeData?: PlaceSelectionResult) => void;
  handleStartOver: () => void;
  apifyBusinessResult?: ApifyBusinessResult | null;
  apifyLoading?: boolean;
}

// This wrapper component maintains the same interface as the original InputPanel
// but delegates to our refactored implementation
const InputPanelWrapper: React.FC<InputPanelWrapperProps> = (props) => {
  return <InputPanel {...props} />;
};

export default InputPanelWrapper;
