
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
      if (webhookResponse) {
        // Add model information if available
        if (webhookResponse.model) {
          result = {
            ...result,
            model: webhookResponse.model
          };
        }
        
        // Update platform results with rank information if available
        if (webhookResponse.estimatedRank) {
          const enhancedPlatformResults = result.platformResults.map((platform, index) => {
            if (index === 0 && !platform.rank) {
              return {
                ...platform,
                rank: webhookResponse.estimatedRank,
                // If the platform doesn't have a name but we have a model, use that
                platform: platform.platform || webhookResponse.model || 'AI Analysis'
              };
            }
            return platform;
          });
          
          // If no platforms exist yet, create one from the webhook data
          if (enhancedPlatformResults.length === 0 && webhookResponse.estimatedRank) {
            enhancedPlatformResults.push({
              platform: webhookResponse.model || 'AI Analysis',
              score: 75, // Default score
              rank: webhookResponse.estimatedRank,
              model: webhookResponse.model
            });
          }
          
          result = {
            ...result,
            platformResults: enhancedPlatformResults
          };
        }
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
