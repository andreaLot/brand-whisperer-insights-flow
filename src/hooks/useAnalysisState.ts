
import { useState } from 'react';
import { PlaceSelectionResult } from '@/hooks/useGooglePlaces';
import { useApifyData } from './analysis/useApifyData';
import { useWebhook } from './analysis/useWebhook';
import { useCategoryDetection } from './analysis/useCategoryDetection';
import { useStepManagement } from './analysis/useStepManagement';
import { useAnalysisResults } from './analysis/useAnalysisResults';
import { UseAnalysisStateResult } from './analysis/types';

export const useAnalysisState = (): UseAnalysisStateResult => {
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');

  // Import refactored hooks
  const { apifyBusinessResult, apifyLoading, fetchApifyBusinessData } = useApifyData();
  const { webhookSent, webhookResponse, sendWebhookData } = useWebhook();
  const { 
    primaryCategory, 
    setPrimaryCategory, 
    category, 
    setCategory,
    suggestedCategories, 
    setSuggestedCategories,
    detectCategory 
  } = useCategoryDetection();
  
  const {
    step,
    setStep,
    isLoading,
    setIsLoading,
    handleBeginAnalysis,
    handleStartOver: baseHandleStartOver,
    handleAnalysisComplete,
    handleChatComplete: baseHandleChatComplete
  } = useStepManagement();
  
  const { analysisResult, analyzeBusinessBrand } = useAnalysisResults();

  const handleLocationSelect = async (selectedLocation: string, placeData?: PlaceSelectionResult) => {
    setLocation(selectedLocation);
    setIsLoading(true);
    
    setStep('analyzing');
    
    if (placeData) {
      setBusinessName(placeData.name || '');
      
      if (placeData.categories && placeData.categories.length > 0) {
        console.log("Setting category from Google Places:", placeData.categories[0]);
        setPrimaryCategory(placeData.categories[0]);
        setCategory(placeData.categories[0]);
        
        const googleCategories = placeData.categories.map((cat, index) => ({
          name: cat,
          confidence: 1 - (index * 0.1)
        }));
        
        setSuggestedCategories(googleCategories);
        
        await sendWebhookData(
          placeData.name || '',
          selectedLocation,
          placeData.categories[0],
          placeData
        );
      }
    }

    // Only fetch from Apify when we have a business name to search for
    if (businessName || (placeData && placeData.name)) {
      const nameToUse = businessName || (placeData && placeData.name) || '';
      // Fetch business data from Apify (which now also gets competitor data)
      const businessResult = await fetchApifyBusinessData(nameToUse, selectedLocation);
      
      if (businessResult && !primaryCategory && businessResult.category) {
        console.log("Setting category from Apify:", businessResult.category);
        setPrimaryCategory(businessResult.category);
        setCategory(businessResult.category);
        
        if (!webhookSent) {
          await sendWebhookData(
            nameToUse,
            selectedLocation,
            businessResult.category
          );
        }
      }
    }
    
    if (!primaryCategory) {
      await detectCategory(businessName);
      
      if (!webhookSent && category) {
        await sendWebhookData(businessName, selectedLocation, category);
      }
    }
  };

  const handleChatComplete = async () => {
    try {
      if (!webhookSent && businessName && location && category) {
        await sendWebhookData(businessName, location, category);
      }
      
      const result = await analyzeBusinessBrand(businessName, location, category, webhookResponse);
      
      setIsLoading(false);
      baseHandleChatComplete();
    } catch (error) {
      console.error('Error in chat completion:', error);
      setIsLoading(false);
      setStep('business-name');
    }
  };

  const handleStartOver = () => {
    baseHandleStartOver();
    setLocation('');
    setBusinessName('');
    setCategory('');
    setPrimaryCategory(undefined);
    setSuggestedCategories([]);
    
    // Clear cached competitor results
    if ((window as any).apifyCategoryResults) {
      delete (window as any).apifyCategoryResults;
    }
  };

  return {
    step,
    businessName,
    location,
    category,
    primaryCategory,
    suggestedCategories,
    isLoading,
    analysisResult,
    apifyBusinessResult,
    apifyLoading,
    webhookSent,
    webhookResponse,
    setBusinessName,
    handleLocationSelect,
    handleBeginAnalysis,
    handleAnalysisComplete,
    handleChatComplete,
    handleStartOver
  };
};
