
import { useState } from 'react';
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

  const analyzeBusinessBrand = async (
    businessName: string, 
    location: string, 
    category: string,
    webhookResponse: WebhookResponse | null
  ) => {
    try {
      console.log("Starting analysis with webhook response:", webhookResponse);
      let result = await AnalysisService.analyzeBrand(businessName, location, category);
      
      // Ensure platformResults always exists
      if (!result.platformResults) {
        result.platformResults = [];
      }
      
      // Enhance results with webhook response data if available
      if (webhookResponse) {
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
          const platformName = normalizeModelToPlatform(webhookResponse.model || 'AI Analysis');
          console.log(`Normalized model ${webhookResponse.model} to platform ${platformName}`);
          
          // Create the entry for this platform with the webhook rank
          result.platformResults.push({
            platform: platformName,
            score: Math.floor(Math.random() * 15) + 75, // Score between 75-90 for demo
            rank: webhookResponse.estimatedRank,
            model: webhookResponse.model
          });
          
          console.log(`Added platform ${platformName} with rank ${webhookResponse.estimatedRank} from webhook`);
          
          // Add additional platforms with relative ranks
          addComparisonPlatforms(result.platformResults, webhookResponse.estimatedRank);
        }
      }
      
      // If no webhook data or if platformResults is still empty, add default platforms
      if (!result.platformResults || result.platformResults.length === 0) {
        console.log("No webhook data or empty results, generating default platform results");
        result.platformResults = generateDefaultPlatformResults();
      }
      
      // Sort the platforms by rank
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
      return null;
    }
  };
  
  // Helper function to add comparison platforms based on the webhook rank
  const addComparisonPlatforms = (platforms: PlatformResult[], webhookRank: number) => {
    // Define common platforms to compare against
    const comparisonPlatforms = [
      "OpenAI", "Perplexity", "Gemini", "DeepSeek", "Mistral", "Anthropic", "Claude"
    ];
    
    // Get the platform we already added
    const existingPlatform = platforms[0].platform;
    
    // Filter out the existing platform
    const availablePlatforms = comparisonPlatforms.filter(p => p !== existingPlatform);
    
    // Add platforms with ranks relative to webhook rank
    let currentRank = 1;
    
    // Add up to 4 comparison platforms
    for (let i = 0; i < Math.min(4, availablePlatforms.length); i++) {
      // Skip the webhook rank
      if (currentRank === webhookRank) {
        currentRank++;
      }
      
      platforms.push({
        platform: availablePlatforms[i],
        score: Math.floor(Math.random() * 15) + 75, // Score between 75-90
        rank: currentRank
      });
      
      currentRank++;
    }
  };
  
  // Generate default platform results if no real data available
  const generateDefaultPlatformResults = (): PlatformResult[] => {
    console.log("Generating default platform results");
    return [
      { platform: 'OpenAI', score: 92, rank: 1 },
      { platform: 'Perplexity', score: 89, rank: 2 },
      { platform: 'Gemini', score: 87, rank: 3 },
      { platform: 'DeepSeek', score: 83, rank: 4 },
      { platform: 'Mistral', score: 81, rank: 5 },
    ];
  };

  return {
    analysisResult,
    setAnalysisResult,
    analyzeBusinessBrand
  };
};
