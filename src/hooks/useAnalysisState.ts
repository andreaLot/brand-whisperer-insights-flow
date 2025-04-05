import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Step } from '@/components/analysis/ConversationPanel';
import { 
  AnalysisService, 
  AnalysisResult, 
  BusinessCategory, 
  ApifyBusinessResult, 
  ApifyCategoryResult 
} from "@/services/AnalysisService";
import { PlaceSelectionResult } from '@/hooks/useGooglePlaces';

export const useAnalysisState = () => {
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
  const [apifyBusinessResult, setApifyBusinessResult] = useState<ApifyBusinessResult | null>(null);
  const [apifyCategoryResults, setApifyCategoryResults] = useState<ApifyCategoryResult[]>([]);
  const [apifyLoading, setApifyLoading] = useState(false);

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

    fetchApifyBusinessData(businessName, selectedLocation);
    detectCategory();
  };

  const fetchApifyBusinessData = async (business: string, locationValue: string) => {
    setApifyLoading(true);
    
    try {
      const businessResult = await AnalysisService.fetchBusinessFromApify(business, locationValue);
      
      if (businessResult) {
        setApifyBusinessResult(businessResult);
        console.log("Apify business data received:", businessResult);
        
        if (!primaryCategory && businessResult.category) {
          setPrimaryCategory(businessResult.category);
          setCategory(businessResult.category);
          
          fetchApifyCategoryData(businessResult.category, extractCity(locationValue));
        }
      }
    } catch (error) {
      console.error("Error fetching business data from Apify:", error);
      toast({
        title: "API Error",
        description: "Failed to fetch business data from Apify.",
        variant: "destructive"
      });
    } finally {
      setApifyLoading(false);
    }
  };
  
  const fetchApifyCategoryData = async (categoryValue: string, city: string) => {
    setApifyLoading(true);
    
    try {
      const query = `${categoryValue} ${city}`;
      console.log("Fetching category data with query:", query);
      
      const categoryResults = await AnalysisService.fetchCategoryFromApify(categoryValue, city);
      
      if (Array.isArray(categoryResults)) {
        setApifyCategoryResults(categoryResults);
        console.log("Apify category data received:", categoryResults);
      }
    } catch (error) {
      console.error("Error fetching category data from Apify:", error);
      toast({
        title: "API Error",
        description: "Failed to fetch category data from Apify.",
        variant: "destructive"
      });
    } finally {
      setApifyLoading(false);
    }
  };
  
  const extractCity = (address: string): string => {
    const cityMatch = address.match(/([A-Za-z\s]+),\s*[A-Z]{2}/);
    if (cityMatch && cityMatch[1]) {
      return cityMatch[1].trim();
    }
    
    const parts = address.split(',');
    return parts.length > 1 ? parts[1].trim() : address;
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
    setApifyBusinessResult(null);
    setApifyCategoryResults([]);
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
    setBusinessName,
    handleLocationSelect,
    handleBeginAnalysis,
    handleAnalysisComplete,
    handleChatComplete,
    handleStartOver
  };
};
