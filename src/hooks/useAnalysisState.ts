
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
import { WebhookService } from '@/services/WebhookService';

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

  const {
    apifyBusinessResult,
    apifyLoading,
    fetchApifyBusinessData
  } = useApifyData();

  // Robust webhook sending function with retries
  const sendWebhookData = async (name: string, loc: string, cat: string) => {
    if (!webhookSent && name && loc && cat) {
      console.log("Sending webhook data immediately");
      setWebhookAttempts(prev => prev + 1);
      
      const webhookSuccess = await WebhookService.sendWebhookData({
        businessName: name,
        location: loc,
        category: cat
      });
      
      if (webhookSuccess) {
        console.log("Webhook data sent successfully");
        setWebhookSent(true);
        
        // Show success toast to confirm webhook sent
        toast({
          title: "Data sent successfully",
          description: "Business information has been transmitted to the external system.",
          variant: "default"
        });
      } else {
        console.warn("Failed to send webhook data");
        
        // Show error toast if multiple attempts have failed
        if (webhookAttempts > 2) {
          toast({
            title: "Warning",
            description: "Having trouble sending data to external system. Will retry later.",
            variant: "destructive"
          });
        }
      }
    }
  };

  // Periodically retry sending webhook data if it failed initially
  useEffect(() => {
    let retryTimer: NodeJS.Timeout | null = null;
    
    if (!webhookSent && businessName && location && category && webhookAttempts > 0 && webhookAttempts < 5) {
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
      
      // Use Google Places API categories if available
      if (placeData.categories && placeData.categories.length > 0) {
        console.log("Setting category from Google Places:", placeData.categories[0]);
        setPrimaryCategory(placeData.categories[0]);
        setCategory(placeData.categories[0]);
        
        // Convert Google Places categories to our BusinessCategory format
        const googleCategories: BusinessCategory[] = placeData.categories.map((cat, index) => ({
          name: cat,
          confidence: 1 - (index * 0.1) // Assign decreasing confidence based on order
        }));
        
        setSuggestedCategories(googleCategories);
        
        // Send webhook data as soon as we have business name, location and category
        await sendWebhookData(
          placeData.name || 'Default Business',
          selectedLocation,
          placeData.categories[0]
        );
      }
    }

    const businessResult = await fetchApifyBusinessData(businessName, selectedLocation);
    
    // Fallback to Apify category if Google Places didn't provide one
    if (businessResult && !primaryCategory && businessResult.category) {
      console.log("Setting category from Apify:", businessResult.category);
      setPrimaryCategory(businessResult.category);
      setCategory(businessResult.category);
      
      // Try sending webhook data again if we didn't have categories before
      if (!webhookSent) {
        await sendWebhookData(
          businessName,
          selectedLocation,
          businessResult.category
        );
      }
    }
    
    // Only run detectCategory as a last resort if we don't have categories yet
    if (!primaryCategory) {
      await detectCategory();
      
      // After detection, try one more time to send webhook if we have a category now
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
      // One last attempt to send webhook data if it wasn't successful earlier
      if (!webhookSent && businessName && location && category) {
        await sendWebhookData(businessName, location, category);
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
    setWebhookAttempts(0);
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
    setBusinessName,
    handleLocationSelect,
    handleBeginAnalysis,
    handleAnalysisComplete,
    handleChatComplete,
    handleStartOver
  };
};
