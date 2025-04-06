
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
  AnalysisService, 
  AnalysisResult
} from "@/services/AnalysisService";
import { WebhookResponse } from '@/services/WebhookService';

export const useAnalysisResults = () => {
  const { toast } = useToast();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const analyzeBusinessBrand = async (
    businessName: string, 
    location: string, 
    category: string,
    webhookResponse: WebhookResponse | null
  ) => {
    try {
      let result = await AnalysisService.analyzeBrand(businessName, location, category);
      
      // Enhance results with webhook response data if available
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
      return result;
    } catch (error) {
      console.error('Error analyzing brand:', error);
      toast({
        title: "Error",
        description: "Failed to analyze your brand. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  };

  return {
    analysisResult,
    setAnalysisResult,
    analyzeBusinessBrand
  };
};
