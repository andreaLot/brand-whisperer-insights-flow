
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Step } from '@/components/analysis/ConversationPanel';
import { 
  AnalysisService, 
  AnalysisResult, 
  BusinessCategory,
} from "@/services/AnalysisService";
import { PlaceSelectionResult } from '@/hooks/useGooglePlaces';
import { useApifyData } from './analysis/useApifyData';
import { extractCity } from './analysis/analysisUtils';
import { UseAnalysisStateResult } from './analysis/types';

export const useAnalysisState = (): UseAnalysisStateResult => {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('welcome');
  const [businessName, setBusinessName] = useState('Default Business');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [primaryCategory, setPrimaryCategory] = useState<string | undefined>(undefined);
  const [suggestedCategories, setSuggestedCategories] = useState<BusinessCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [webhookSent, setWebhookSent] = useState(false);

  const {
    apifyBusinessResult,
    apifyCategoryResults,
    apifyLoading,
    fetchApifyBusinessData,
    fetchApifyCategoryData
  } = useApifyData();

  const handleLocationSelect = async (selectedLocation: string, placeData?: PlaceSelectionResult) => {
    setLocation(selectedLocation);
    setIsLoading(true);
    
    setStep('analyzing');
    
    if (placeData) {
      setBusinessName(placeData.name || 'Default Business');
      
      if (placeData.categories && placeData.categories.length > 0) {
        setPrimaryCategory(placeData.categories[0]);
      }
    }

    const businessResult = await fetchApifyBusinessData(businessName, selectedLocation);
    
    if (businessResult && !primaryCategory && businessResult.category) {
      setPrimaryCategory(businessResult.category);
      setCategory(businessResult.category);
      
      fetchApifyCategoryData(businessResult.category, extractCity(selectedLocation));
    }
    
    detectCategory();
  };

  const detectCategory = async () => {
    try {
      const categories = await AnalysisService.detectCategory(businessName);
      setSuggestedCategories(categories);

      if (categories.length > 0 && !primaryCategory) {
        const detectedCategory = categories[0].name;
        setCategory(detectedCategory);
        
        fetchApifyCategoryData(detectedCategory, extractCity(location));
      }
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
  };

  const handleBeginAnalysis = () => {
    setStep('business-name');
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
    apifyCategoryResults,
    apifyLoading,
    webhookSent,
    setBusinessName,
    handleLocationSelect,
    handleBeginAnalysis,
    handleAnalysisComplete,
    handleChatComplete,
    handleStartOver
  };
};
