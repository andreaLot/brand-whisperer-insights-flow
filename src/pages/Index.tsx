
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { AnalysisService, AnalysisResult, BusinessCategory } from "@/services/AnalysisService";
import ConversationPanel from '@/components/analysis/ConversationPanel';
import InputPanel from '@/components/analysis/InputPanel';
import { PlaceSelectionResult } from '@/hooks/useGooglePlaces';

// Flow step type
type Step = 'welcome' | 'business-name' | 'category-detection' | 'analyzing' | 'chatbot' | 'results';

const Index = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('welcome');
  const [businessName, setBusinessName] = useState('Default Business'); // Default business name
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [primaryCategory, setPrimaryCategory] = useState<string | undefined>(undefined);
  const [suggestedCategories, setSuggestedCategories] = useState<BusinessCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Handle location selection
  const handleLocationSelect = (selectedLocation: string, placeData?: PlaceSelectionResult) => {
    setLocation(selectedLocation);
    setIsLoading(true);
    setStep('category-detection');
    
    // Set business name and primary category if available
    if (placeData) {
      setBusinessName(placeData.name || 'Default Business');
      
      // Extract primary category (first type from the types array)
      if (placeData.categories && placeData.categories.length > 0) {
        setPrimaryCategory(placeData.categories[0]);
      }
    }

    // Detect business category
    detectCategory();
  };

  // Detect business category
  const detectCategory = async () => {
    try {
      const categories = await AnalysisService.detectCategory(businessName);
      setSuggestedCategories(categories);

      // Auto-select the highest confidence category
      if (categories.length > 0) {
        setCategory(categories[0].name);
      }

      // Move to analysis step after a short delay
      setTimeout(() => {
        setStep('analyzing');
      }, 2000);
    } catch (error) {
      console.error('Error detecting category:', error);
      toast({
        title: "Error",
        description: "Failed to detect business category. Please try again.",
        variant: "destructive"
      });
      setStep('business-name');
    }
  };

  // When analysis visualization is complete, move to chatbot step
  const handleAnalysisComplete = () => {
    setStep('chatbot');
  };

  // When chat is complete, show results
  const handleChatComplete = async () => {
    try {
      // Only fetch results when moving from chat to results
      const result = await AnalysisService.analyzeBrand(businessName, location, category);
      setAnalysisResult(result);
      setIsLoading(false);
      setStep('results');
    } catch (error) {
      console.error('Error analyzing brand:', error);
      toast({
        title: "Error",
        description: "Failed to analyze your brand. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
      setStep('business-name');
    }
  };

  // Analyze the brand
  const analyzeBrand = () => {
    // This is now just a placeholder - analysis happens when chat completes
  };

  // Start over from beginning
  const handleStartOver = () => {
    setStep('welcome');
    setLocation('');
    setCategory('');
    setPrimaryCategory(undefined);
    setSuggestedCategories([]);
    setAnalysisResult(null);
  };

  // Begin analysis flow
  const handleBeginAnalysis = () => {
    setStep('business-name');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-black p-4 text-white">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8">
        {/* Left side - Conversation */}
        <ConversationPanel
          step={step}
          analysisResult={analysisResult}
          suggestedCategories={suggestedCategories}
          primaryCategory={primaryCategory}
          location={location}
          onBeginAnalysis={handleBeginAnalysis}
          onStartOver={handleStartOver}
          onAnalysisComplete={handleAnalysisComplete}
          onChatComplete={handleChatComplete}
          handleLocationSelect={handleLocationSelect}
        />
        
        {/* Right side - Input/Results */}
        <InputPanel
          step={step}
          businessName={businessName}
          analysisResult={analysisResult}
          suggestedCategories={suggestedCategories}
          setBusinessName={setBusinessName}
          handleBusinessNameSubmit={() => {}}
          handleLocationSelect={handleLocationSelect}
          handleStartOver={handleStartOver}
        />
      </div>
      
      {/* Embed info */}
      <div className="mt-12 text-center text-xs text-gray-500">
        <p>Brand Whisperer v1.0 - Embed this tool on your website with a simple iframe.</p>
      </div>
    </div>
  );
};

export default Index;
