
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { AnalysisService, AnalysisResult, BusinessCategory, ApifyBusinessResult, ApifyCategoryResult } from "@/services/AnalysisService";
import ConversationPanel, { Step } from '@/components/analysis/ConversationPanel';
import InputPanel from '@/components/analysis/InputPanel';
import { PlaceSelectionResult } from '@/hooks/useGooglePlaces';

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
  const [webhookSent, setWebhookSent] = useState(false);
  const [apifyBusinessResult, setApifyBusinessResult] = useState<ApifyBusinessResult | null>(null);
  const [apifyCategoryResults, setApifyCategoryResults] = useState<ApifyCategoryResult[]>([]);
  const [apifyLoading, setApifyLoading] = useState(false);

  const handleLocationSelect = async (selectedLocation: string, placeData?: PlaceSelectionResult) => {
    setLocation(selectedLocation);
    setIsLoading(true);
    setStep('category-detection');
    
    if (placeData) {
      setBusinessName(placeData.name || 'Default Business');
      
      if (placeData.categories && placeData.categories.length > 0) {
        setPrimaryCategory(placeData.categories[0]);
      }
    }

    // Start Apify API calls in parallel with category detection
    fetchApifyData(businessName, selectedLocation);
    detectCategory();
  };

  const fetchApifyData = async (business: string, locationValue: string) => {
    setApifyLoading(true);
    
    try {
      // Run both Apify calls in parallel
      const [businessResult, categoryResult] = await Promise.allSettled([
        AnalysisService.fetchBusinessFromApify(business, locationValue),
        primaryCategory ? 
          AnalysisService.fetchCategoryFromApify(primaryCategory, locationValue) :
          Promise.resolve([])
      ]);
      
      // Handle business result
      if (businessResult.status === 'fulfilled' && businessResult.value) {
        setApifyBusinessResult(businessResult.value);
        console.log("Apify business data received:", businessResult.value);
        
        // If we didn't get a category from place data, try to use the one from Apify
        if (!primaryCategory && businessResult.value.category) {
          setPrimaryCategory(businessResult.value.category);
          setCategory(businessResult.value.category);
        }
      } else {
        console.error("Apify business data fetch failed:", businessResult);
      }
      
      // Handle category results
      if (categoryResult.status === 'fulfilled' && Array.isArray(categoryResult.value)) {
        setApifyCategoryResults(categoryResult.value);
        console.log("Apify category data received:", categoryResult.value);
      } else {
        console.error("Apify category data fetch failed:", categoryResult);
      }
    } catch (error) {
      console.error("Error fetching data from Apify:", error);
      toast({
        title: "API Error",
        description: "Failed to fetch data from Apify. Using fallback data.",
        variant: "destructive"
      });
    } finally {
      setApifyLoading(false);
    }
  };

  const detectCategory = async () => {
    try {
      const categories = await AnalysisService.detectCategory(businessName);
      setSuggestedCategories(categories);

      if (categories.length > 0 && !primaryCategory) {
        setCategory(categories[0].name);
      }

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

  const handleAnalysisComplete = () => {
    setStep('chatbot');
  };

  const handleChatComplete = async () => {
    try {
      // Send data to webhook if not already sent
      if (!webhookSent) {
        const categoryToUse = primaryCategory || category;
        const webhookSuccess = await AnalysisService.sendWebhookData({
          businessName,
          location,
          category: categoryToUse
        });
        
        if (webhookSuccess) {
          console.log("Webhook data sent successfully");
          setWebhookSent(true);
        } else {
          console.warn("Failed to send webhook data");
        }
      }
      
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

  const handleStartOver = () => {
    setStep('welcome');
    setLocation('');
    setCategory('');
    setPrimaryCategory(undefined);
    setSuggestedCategories([]);
    setAnalysisResult(null);
    setWebhookSent(false);
    setApifyBusinessResult(null);
    setApifyCategoryResults([]);
  };

  const handleBeginAnalysis = () => {
    setStep('business-name');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-black p-4 text-white">
      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-8">
        <ConversationPanel
          step={step}
          analysisResult={analysisResult}
          suggestedCategories={suggestedCategories}
          primaryCategory={primaryCategory}
          location={location}
          businessName={businessName}
          onBeginAnalysis={handleBeginAnalysis}
          onStartOver={handleStartOver}
          onAnalysisComplete={handleAnalysisComplete}
          onChatComplete={handleChatComplete}
          handleLocationSelect={handleLocationSelect}
        />
        
        <InputPanel
          step={step}
          businessName={businessName}
          analysisResult={analysisResult}
          suggestedCategories={suggestedCategories}
          setBusinessName={setBusinessName}
          handleBusinessNameSubmit={() => {}}
          handleLocationSelect={handleLocationSelect}
          handleStartOver={handleStartOver}
          apifyBusinessResult={apifyBusinessResult}
          apifyCategoryResults={apifyCategoryResults}
          apifyLoading={apifyLoading}
        />
      </div>
      
      <div className="mt-12 text-center text-xs text-gray-500">
        <p>Brand Whisperer v1.0 - Embed this tool on your website with a simple iframe.</p>
      </div>
    </div>
  );
};

export default Index;
