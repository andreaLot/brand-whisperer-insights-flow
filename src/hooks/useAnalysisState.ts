import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Step } from '@/components/analysis/ConversationPanel';
import { 
  AnalysisService, 
  AnalysisResult, 
  BusinessCategory,
} from "@/services/AnalysisService";
import { PlaceSelectionResult } from '@/hooks/useGooglePlaces';
import { useApifyData } from './analysis/useApifyData';
import { UseAnalysisStateResult } from './analysis/types';
import { WebhookService, WebhookResponse } from '@/services/WebhookService';

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
  const [webhookAttempts, setWebhookAttempts] = useState(0);
  const [webhookResponse, setWebhookResponse] = useState<WebhookResponse | null>(null);

  const {
    apifyBusinessResult,
    apifyLoading,
    fetchApifyBusinessData
  } = useApifyData();

  const sendWebhookData = async (name: string, loc: string, cat: string, placeData?: PlaceSelectionResult) => {
    if (name && loc) {
      console.log("Sending webhook data with all place details");
      setWebhookAttempts(prev => prev + 1);
      
      const webhookData = {
        businessName: name,
        location: loc,
        category: cat,
        ...(placeData || {})
      };
      
      const response = await WebhookService.sendWebhookData(webhookData);
      
      if (response) {
        console.log("Webhook data sent and response received:", response);
        setWebhookSent(true);
        setWebhookResponse(response);
        
        // Show a toast notification if we got estimated rank data
        if (response.estimatedRank) {
          toast({
            title: "Rank Estimate Received",
            description: `Your business has an estimated rank of #${response.estimatedRank} in its category`,
          });
        }
      } else {
        console.warn("Failed to send webhook data or receive response");
      }
    }
  };

  useEffect(() => {
    let retryTimer: NodeJS.Timeout | null = null;
    
    if (!webhookSent && businessName && location && webhookAttempts > 0 && webhookAttempts < 5) {
      retryTimer = setTimeout(() => {
        console.log(`Retry attempt ${webhookAttempts + 1} to send webhook data`);
        sendWebhookData(businessName, location, category);
      }, 3000); // Retry every 3 seconds, up to 5 times
    }
    
    return () => {
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [webhookSent, businessName, location, category, webhookAttempts]);

  const handleLocationSelect = async (selectedLocation: string, placeData?: PlaceSelectionResult) => {
    setLocation(selectedLocation);
    setIsLoading(true);
    
    setStep('analyzing');
    
    if (placeData) {
      setBusinessName(placeData.name || 'Default Business');
      
      if (placeData.categories && placeData.categories.length > 0) {
        console.log("Setting category from Google Places:", placeData.categories[0]);
        setPrimaryCategory(placeData.categories[0]);
        setCategory(placeData.categories[0]);
        
        const googleCategories: BusinessCategory[] = placeData.categories.map((cat, index) => ({
          name: cat,
          confidence: 1 - (index * 0.1)
        }));
        
        setSuggestedCategories(googleCategories);
        
        await sendWebhookData(
          placeData.name || 'Default Business',
          selectedLocation,
          placeData.categories[0],
          placeData
        );
      }
    }

    const businessResult = await fetchApifyBusinessData(businessName, selectedLocation);
    
    if (businessResult && !primaryCategory && businessResult.category) {
      console.log("Setting category from Apify:", businessResult.category);
      setPrimaryCategory(businessResult.category);
      setCategory(businessResult.category);
      
      if (!webhookSent) {
        await sendWebhookData(
          businessName,
          selectedLocation,
          businessResult.category
        );
      }
    }
    
    if (!primaryCategory) {
      await detectCategory();
      
      if (!webhookSent && category) {
        await sendWebhookData(businessName, selectedLocation, category);
      }
    }
  };

  const detectCategory = async () => {
    try {
      const categories = await AnalysisService.detectCategory(businessName);
      setSuggestedCategories(categories);

      if (categories.length > 0 && !primaryCategory) {
        const detectedCategory = categories[0].name;
        setCategory(detectedCategory);
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
      if (!webhookSent && businessName && location && category) {
        await sendWebhookData(businessName, location, category);
      }
      
      let result = await AnalysisService.analyzeBrand(businessName, location, category);
      
      if (webhookResponse && webhookResponse.estimatedRank) {
        const enhancedPlatformResults = result.platformResults.map((platform, index) => {
          if (index === 0 && !platform.rank && webhookResponse.estimatedRank) {
            return {
              ...platform,
              rank: webhookResponse.estimatedRank
            };
          }
          return platform;
        });
        
        result = {
          ...result,
          platformResults: enhancedPlatformResults
        };
      }
      
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
    setWebhookAttempts(0);
    setWebhookResponse(null);
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
