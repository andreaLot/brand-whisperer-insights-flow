
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
      if (webhookResponse) {
        console.log("Processing webhook data for platform results:", webhookResponse);
        
        // Clear existing platform results to avoid duplicates
        result.platformResults = [];
        
        // Add model information if available
        if (webhookResponse.model) {
          result = {
            ...result,
            model: webhookResponse.model
          };
          
          // First normalize the model name to a proper platform name
          const platformName = normalizeModelToPlatform(webhookResponse.model);
          console.log(`Normalized model ${webhookResponse.model} to platform ${platformName}`);
          
          // Generate a realistic score based on the rank (higher ranks get higher scores)
          const baseScore = webhookResponse.estimatedRank 
            ? 95 - ((webhookResponse.estimatedRank - 1) * 3)
            : 85;
          const score = Math.max(60, Math.min(95, baseScore + (Math.random() * 4 - 2))); // Add some randomness
          
          // Create the entry for this platform with the webhook rank
          result.platformResults.push({
            platform: platformName,
            score: Math.round(score), // Round to whole number
            rank: webhookResponse.estimatedRank,
            model: webhookResponse.model
          });
          
          console.log(`Added platform ${platformName} with rank ${webhookResponse.estimatedRank} from webhook`);
          
          // Add additional platforms with relative rankings
          // Each AI platform will have its own entry with a unique rank
          addPlatformWithRank(result.platformResults, "OpenAI", "gpt-4o");
          addPlatformWithRank(result.platformResults, "Perplexity", "llama-3.1-sonar");
          addPlatformWithRank(result.platformResults, "Mistral", "mistral-large-latest");
          addPlatformWithRank(result.platformResults, "DeepSeek", "deepseek-chat");
          addPlatformWithRank(result.platformResults, "Gemini", "gemini-1.5-flash");
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

  // Helper function to add a platform with a unique rank
  const addPlatformWithRank = (
    platformResults: PlatformResult[], 
    platform: string, 
    model: string
  ) => {
    // Skip if this platform is already in the results
    if (platformResults.some(p => p.platform === platform)) {
      return;
    }
    
    // Find an unused rank between 1-5
    const usedRanks = platformResults.map(p => p.rank).filter(r => r !== undefined) as number[];
    let rank = 1;
    while (usedRanks.includes(rank) && rank <= 5) {
      rank++;
    }
    
    // Only add if we found an available rank
    if (rank <= 5) {
      const score = Math.max(60, Math.min(95, 95 - ((rank - 1) * 3) + (Math.random() * 4 - 2)));
      
      platformResults.push({
        platform,
        model,
        score: Math.round(score),
        rank
      });
      
      console.log(`Added platform ${platform} with assigned rank ${rank}`);
    }
  };

  return {
    analysisResult,
    setAnalysisResult,
    analyzeBusinessBrand
  };
};
