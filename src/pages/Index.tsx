
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { AnalysisService, AnalysisResult, BusinessCategory } from "@/services/AnalysisService";
import ConversationPanel from '@/components/analysis/ConversationPanel';
import InputPanel from '@/components/analysis/InputPanel';

// Flow step type
type Step = 'welcome' | 'business-name' | 'location' | 'category-detection' | 'analyzing' | 'results';

const Index = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('welcome');
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [suggestedCategories, setSuggestedCategories] = useState<BusinessCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Handle business name submission
  const handleBusinessNameSubmit = async () => {
    if (!businessName.trim()) {
      toast({
        title: "Business name required",
        description: "Please enter your business name to continue",
        variant: "destructive"
      });
      return;
    }
    setStep('location');
  };

  // Handle location selection
  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
    setIsLoading(true);
    setStep('category-detection');

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
        analyzeBrand();
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

  // Analyze the brand
  const analyzeBrand = async () => {
    try {
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

  // Start over from beginning
  const handleStartOver = () => {
    setStep('welcome');
    setBusinessName('');
    setLocation('');
    setCategory('');
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
          onBeginAnalysis={handleBeginAnalysis}
          onStartOver={handleStartOver}
        />
        
        {/* Right side - Input/Results */}
        <InputPanel
          step={step}
          businessName={businessName}
          analysisResult={analysisResult}
          suggestedCategories={suggestedCategories}
          setBusinessName={setBusinessName}
          handleBusinessNameSubmit={handleBusinessNameSubmit}
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
