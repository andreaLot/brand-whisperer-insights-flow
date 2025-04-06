
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
      let result = await AnalysisService.analyzeBrand(businessName, location, category);
      
      // Enhance results with webhook response data if available
      if (webhookResponse) {
        console.log("Enhancing results with webhook data:", webhookResponse);
        
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
          
          // Check if this platform already exists in our results
          const existingPlatformIndex = result.platformResults.findIndex(
            p => p.platform?.toLowerCase() === platformName.toLowerCase()
          );
          
          if (existingPlatformIndex >= 0) {
            // Update the existing platform entry
            result.platformResults[existingPlatformIndex] = {
              ...result.platformResults[existingPlatformIndex],
              rank: webhookResponse.estimatedRank,
              // Ensure we have the correct platform name
              platform: platformName
            };
          } else {
            // If the platform doesn't exist yet, add it
            result.platformResults.push({
              platform: platformName,
              score: Math.floor(Math.random() * 15) + 75, // Score between 75-90 for demo
              rank: webhookResponse.estimatedRank,
              model: webhookResponse.model
            });
          }
        }
        
        // Sort platforms by rank after update 
        // But also make sure we assign ranks to ALL platforms based on their score if they don't have a rank
        result.platformResults = assignRanksBasedOnScore(result.platformResults);
      } else {
        // If no webhook data, ensure all platforms have ranks based on scores
        result.platformResults = assignRanksBasedOnScore(result.platformResults);
      }
      
      // Ensure we have at least some platform results for a better demo experience
      if (result.platformResults.length === 0) {
        result.platformResults = generateDefaultPlatformResults();
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
  
  // Helper function to assign ranks based on scores for platforms that don't have ranks yet
  const assignRanksBasedOnScore = (platforms: PlatformResult[]): PlatformResult[] => {
    // First, sort by score (descending)
    const sortedByScore = [...platforms].sort((a, b) => b.score - a.score);
    
    // Map of platforms that already have ranks
    const platformsWithRanks = new Map<number, string>();
    
    // Collect existing ranks
    sortedByScore.forEach(platform => {
      if (platform.rank !== undefined) {
        platformsWithRanks.set(platform.rank, platform.platform || '');
      }
    });
    
    // Find next available rank
    let nextRank = 1;
    const getNextAvailableRank = () => {
      while (platformsWithRanks.has(nextRank)) {
        nextRank++;
      }
      return nextRank;
    };
    
    // Assign ranks where missing
    return sortedByScore.map(platform => {
      if (platform.rank === undefined) {
        const rank = getNextAvailableRank();
        platformsWithRanks.set(rank, platform.platform || '');
        return { ...platform, rank };
      }
      return platform;
    });
  };
  
  // Generate default platform results if no real data available
  const generateDefaultPlatformResults = (): PlatformResult[] => {
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
