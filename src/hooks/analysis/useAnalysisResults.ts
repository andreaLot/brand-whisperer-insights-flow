
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
  AnalysisService, 
  AnalysisResult,
  PlatformResult
} from "@/services/AnalysisService";
import { WebhookResponse } from '@/services/types';
import { normalizeModelToPlatform } from '@/services/WebhookService';

export const useAnalysisResults = () => {
  const { toast } = useToast();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Initialize with null instead of default values
  useEffect(() => {
    if (!analysisResult) {
      const initialResult: AnalysisResult = {
        businessName: "Your Business",
        location: "",
        category: "",
        overallScore: 85,
        platformResults: [], // Start with empty platform results
        strengths: [],
        weaknesses: [],
        recommendations: []
      };
      
      setAnalysisResult(initialResult);
    }
  }, []);

  const analyzeBusinessBrand = async (
    businessName: string, 
    location: string, 
    category: string,
    webhookResponse: WebhookResponse | null
  ) => {
    try {
      console.log("Starting analysis with webhook response:", webhookResponse);
      let result = await AnalysisService.analyzeBrand(businessName, location, category);
      
      // Initialize empty platformResults if not present
      if (!result.platformResults) {
        result.platformResults = [];
      }
      
      // Only use webhook response data if available
      if (webhookResponse && webhookResponse.model) {
        console.log("Using webhook data for platform results:", webhookResponse);
        
        // Add model information if available
        if (webhookResponse.model) {
          result = {
            ...result,
            model: webhookResponse.model
          };
        }
        
        // Update platform results with rank information if available
        if (webhookResponse.estimatedRank) {
          // First normalize the model name to a proper platform name
          const platformName = normalizeModelToPlatform(webhookResponse.model);
          console.log(`Normalized model ${webhookResponse.model} to platform ${platformName}`);
          
          // Generate a realistic score based on the rank (higher ranks get higher scores)
          const baseScore = 95 - ((webhookResponse.estimatedRank - 1) * 3);
          const score = Math.max(60, Math.min(95, baseScore + (Math.random() * 4 - 2))); // Add some randomness
          
          // Create the entry for this platform with the webhook rank
          result.platformResults.push({
            platform: platformName,
            score: Math.round(score), // Round to whole number
            rank: webhookResponse.estimatedRank,
            model: webhookResponse.model
          });
          
          console.log(`Added platform ${platformName} with rank ${webhookResponse.estimatedRank} from webhook`);
          
          // Don't add comparison platforms, we want to rely on real data only
        }
      }
      
      // Sort the platforms by rank (if available)
      result.platformResults.sort((a, b) => {
        if (a.rank !== undefined && b.rank !== undefined) {
          return a.rank - b.rank;
        }
        return 0;
      });
      
      // Log final platform results
      console.log("Final platform results:", JSON.stringify(result.platformResults));
      
      setAnalysisResult(result);
      return result;
    } catch (error) {
      console.error('Error analyzing brand:', error);
      toast({
        title: "Error",
        description: "Failed to analyze your brand. Please try again.",
        variant: "destructive"
      });
      
      // Return minimal results on error
      const errorResult: AnalysisResult = {
        businessName: businessName || "Your Business",
        location: location || "",
        category: category || "",
        overallScore: 85,
        platformResults: [], // Empty platform results
        strengths: [],
        weaknesses: [],
        recommendations: []
      };
      
      setAnalysisResult(errorResult);
      return errorResult;
    }
  };

  return {
    analysisResult,
    setAnalysisResult,
    analyzeBusinessBrand
  };
};
