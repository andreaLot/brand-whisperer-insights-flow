
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
          console.log(`Normalized model ${webhookResponse.model} to platform ${platformName}`);
          
          // Check if this platform already exists in our results
          const existingPlatformIndex = result.platformResults.findIndex(
            p => p.platform?.toLowerCase() === platformName.toLowerCase()
          );
          
          if (existingPlatformIndex >= 0) {
            // Log the platform match
            console.log(`Found matching platform at index ${existingPlatformIndex}: ${result.platformResults[existingPlatformIndex].platform}`);
            
            // Update the existing platform entry with the webhook rank
            result.platformResults[existingPlatformIndex] = {
              ...result.platformResults[existingPlatformIndex],
              rank: webhookResponse.estimatedRank,
              // Ensure we have the correct platform name
              platform: platformName
            };
            
            console.log(`Updated platform rank to ${webhookResponse.estimatedRank}`);
          } else {
            // If the platform doesn't exist yet, add it
            console.log(`Platform ${platformName} not found, adding new entry with rank ${webhookResponse.estimatedRank}`);
            result.platformResults.push({
              platform: platformName,
              score: Math.floor(Math.random() * 15) + 75, // Score between 75-90 for demo
              rank: webhookResponse.estimatedRank,
              model: webhookResponse.model
            });
          }
          
          // Log the platform results after webhook updating
          console.log("Platform results after webhook update:", JSON.stringify(result.platformResults));
        }
        
        // Sort platforms by rank after update 
        // But also make sure we assign ranks to ALL platforms based on their score if they don't have a rank
        result.platformResults = assignRanksBasedOnScore(result.platformResults);
      } else {
        // If no webhook data, ensure all platforms have ranks based on scores
        result.platformResults = assignRanksBasedOnScore(result.platformResults);
      }
      
      // IMPORTANT: Don't generate default results if we already have platform results
      // This was causing webhook ranks to be ignored
      if (result.platformResults.length === 0) {
        console.log("No platform results available, generating defaults");
        result.platformResults = generateDefaultPlatformResults();
      } else {
        console.log("Using existing platform results, not generating defaults");
      }
      
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
  
  // Helper function to assign ranks based on scores for platforms that don't have ranks yet
  const assignRanksBasedOnScore = (platforms: PlatformResult[]): PlatformResult[] => {
    console.log("Assigning ranks based on scores for platforms:", platforms);
    
    // First make a copy of the platforms array to avoid modifying the original
    const platformsCopy = [...platforms];
    
    // Map of platforms that already have ranks
    const platformsWithRanks = new Map<number, string>();
    
    // Collect existing ranks
    platformsCopy.forEach(platform => {
      if (platform.rank !== undefined) {
        platformsWithRanks.set(platform.rank, platform.platform || '');
        console.log(`Platform ${platform.platform} already has rank ${platform.rank}`);
      }
    });
    
    // First assign ranks to platforms without ranks
    // Sort remaining platforms by score (descending)
    const platformsWithoutRanks = platformsCopy
      .filter(p => p.rank === undefined)
      .sort((a, b) => b.score - a.score);
    
    // Find next available rank
    let nextRank = 1;
    const getNextAvailableRank = () => {
      while (platformsWithRanks.has(nextRank)) {
        nextRank++;
      }
      return nextRank;
    };
    
    // Assign ranks to platforms that don't have them
    platformsWithoutRanks.forEach(platform => {
      const rank = getNextAvailableRank();
      platformsWithRanks.set(rank, platform.platform || '');
      platform.rank = rank;
      console.log(`Assigned rank ${rank} to platform ${platform.platform} based on score ${platform.score}`);
      nextRank++;
    });
    
    // Return the combined and updated platforms array
    const rankedPlatforms = [...platformsCopy.filter(p => p.rank !== undefined)];
    console.log("Final ranked platforms:", rankedPlatforms);
    return rankedPlatforms;
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
