
import { Step } from '@/components/analysis/ConversationPanel';
import { 
  AnalysisResult, 
  BusinessCategory, 
  ApifyBusinessResult,
  WebhookResponse
} from "@/services/types";
import { PlaceSelectionResult } from '@/hooks/useGooglePlaces';

export interface AnalysisState {
  step: Step;
  businessName: string;
  location: string;
  category: string;
  primaryCategory?: string;
  suggestedCategories: BusinessCategory[];
  isLoading: boolean;
  analysisResult: AnalysisResult | null;
  webhookSent: boolean;
  webhookResponse: WebhookResponse | null;
  apifyBusinessResult: ApifyBusinessResult | null;
  apifyLoading: boolean;
}

export interface AnalysisActions {
  setBusinessName: (name: string) => void;
  handleLocationSelect: (location: string, placeData?: PlaceSelectionResult) => void;
  handleBeginAnalysis: () => void;
  handleAnalysisComplete: () => void;
  handleChatComplete: () => void;
  handleStartOver: () => void;
}

export interface UseAnalysisStateResult extends AnalysisState, AnalysisActions {}
