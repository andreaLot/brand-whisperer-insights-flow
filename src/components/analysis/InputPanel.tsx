
import React, { useState, useEffect } from 'react';
import ResultsStep from './ResultsStep';
import { AnalysisResult, BusinessCategory, ApifyBusinessResult, ApifyCategoryResult } from "@/services/AnalysisService";
import { PlaceSelectionResult } from '@/hooks/useGooglePlaces';
import { Step } from './ConversationPanel';
import LocationPanel from './panels/LocationPanel';
import CategoryDetectionPanel from './panels/CategoryDetectionPanel';
import AnalyzingVideoPanel from './panels/AnalyzingVideoPanel';
import ChatbotContent from './panels/chatbot/ChatbotContent';

interface InputPanelProps {
  step: Step;
  businessName: string;
  analysisResult: AnalysisResult | null;
  suggestedCategories: BusinessCategory[];
  setBusinessName: (name: string) => void;
  handleBusinessNameSubmit: () => void;
  handleLocationSelect: (location: string, placeData?: PlaceSelectionResult) => void;
  handleStartOver: () => void;
  apifyBusinessResult?: ApifyBusinessResult | null;
  apifyCategoryResults?: ApifyCategoryResult[];
  apifyLoading?: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({
  step,
  businessName,
  analysisResult,
  suggestedCategories,
  setBusinessName,
  handleBusinessNameSubmit,
  handleLocationSelect,
  handleStartOver,
  apifyBusinessResult,
  apifyCategoryResults = [],
  apifyLoading = false
}) => {
  // Track which snippet is being shown during chatbot interaction
  const [visibleSnippet, setVisibleSnippet] = useState<'none' | 'competitors' | 'seo' | 'content'>('none');
  const [cachedCompetitors, setCachedCompetitors] = useState<ApifyCategoryResult[]>([]);
  
  // Check if we have cached competitor results from the business search
  useEffect(() => {
    const cachedResults = (window as any).apifyCategoryResults;
    if (cachedResults && cachedResults.length > 0) {
      console.log("Using cached competitor results in InputPanel:", cachedResults);
      setCachedCompetitors(cachedResults);
    }
  }, [step]); // Check whenever step changes
  
  // Listen for message changes in ChatbotStep
  useEffect(() => {
    const handleChatbotMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'chatbot-selection') {
        if (event.data.message.includes('competitors')) {
          setVisibleSnippet('competitors');
        } else if (event.data.message.includes('SEO')) {
          setVisibleSnippet('seo');
        } else if (event.data.message.includes('Content')) {
          setVisibleSnippet('content');
        }
      }
    };
    
    window.addEventListener('message', handleChatbotMessage);
    return () => {
      window.removeEventListener('message', handleChatbotMessage);
    };
  }, []);

  // Monitor step changes and reset snippet visibility when appropriate
  useEffect(() => {
    if (step !== 'chatbot') {
      setVisibleSnippet('none');
    }
  }, [step]);

  // Combine provided apifyCategoryResults with cached results
  const effectiveCompetitors = cachedCompetitors.length > 0 ? cachedCompetitors : apifyCategoryResults;

  return (
    <div className="w-full md:w-[65%]">
      {/* Show location selector in the welcome step */}
      {step === 'welcome' && (
        <LocationPanel handleLocationSelect={handleLocationSelect} />
      )}
      
      {step === 'category-detection' && (
        <CategoryDetectionPanel 
          suggestedCategories={suggestedCategories}
          apifyLoading={apifyLoading}
        />
      )}
      
      {/* Show video during analyzing step with higher z-index */}
      {step === 'analyzing' && (
        <div className="relative z-10">
          <AnalyzingVideoPanel />
        </div>
      )}
      
      {/* Chatbot-triggered content snippets */}
      {step === 'chatbot' && (
        <div className="space-y-4 animate-fade-in">
          <ChatbotContent 
            visibleSnippet={visibleSnippet}
            apifyCategoryResults={effectiveCompetitors}
            analysisResult={analysisResult}
            apifyBusinessResult={apifyBusinessResult}
          />
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
