
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
        platformResults: [],
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
        console.log("Processing webhook data for platform results:", JSON.stringify(webhookResponse, null, 2));
        
        // Clear existing platform results to avoid duplicates
        result.platformResults = [];
        
        // Check for the new platforms array format
        if (webhookResponse.platforms && webhookResponse.platforms.length > 0) {
          console.log(`Found ${webhookResponse.platforms.length} platforms in webhook response`);
          
          // Process each platform in the response
          webhookResponse.platforms.forEach(platformData => {
            // Get the normalized platform name
            const platformName = normalizeModelToPlatform(platformData.model || platformData.platform);
            
            // Generate a score based on the rank (higher ranks get lower scores)
            const baseScore = platformData.estimatedRank 
              ? Math.max(60, 95 - ((platformData.estimatedRank - 1) * 5))
              : 85;
            
            // Add the platform to the results
            result.platformResults.push({
              platform: platformName,
              score: Math.round(baseScore), // Round to whole number
              rank: platformData.estimatedRank,
              model: platformData.model
            });
            
            console.log(`Added platform ${platformName} with rank ${platformData.estimatedRank} from webhook`);
          });
        } 
        // Handle legacy single platform format
        else if (webhookResponse.model || webhookResponse.platform) {
          // Add model information if available
          if (webhookResponse.model) {
            result = {
              ...result,
              model: webhookResponse.model
            };
            
            // First normalize the model name to a proper platform name
            const platformName = normalizeModelToPlatform(webhookResponse.model);
            console.log(`Normalized model ${webhookResponse.model} to platform ${platformName}`);
            
            // Generate a score based on the rank (higher ranks get lower scores)
            const baseScore = webhookResponse.estimatedRank 
              ? Math.max(60, 95 - ((webhookResponse.estimatedRank - 1) * 5))
              : 85;
            
            // Create the entry for this platform with the webhook rank
            result.platformResults.push({
              platform: platformName,
              score: Math.round(baseScore), // Round to whole number
              rank: webhookResponse.estimatedRank,
              model: webhookResponse.model
            });
            
            console.log(`Added platform ${platformName} with rank ${webhookResponse.estimatedRank} from webhook`);
          }
        }
      }
      
      // If we still don't have any platforms from webhook, use simulated ones
      // We'll always have platforms now due to simulation service
      if (result.platformResults.length === 0) {
        console.log("No platform results from webhook, using simulation");
        const simulatedResponse = await AnalysisService.sendWebhookData({
          businessName,
          location,
          category
        });
        
        if (simulatedResponse && simulatedResponse.platforms) {
          simulatedResponse.platforms.forEach(platformData => {
            const platformName = normalizeModelToPlatform(platformData.model || platformData.platform);
            const baseScore = platformData.estimatedRank 
              ? Math.max(60, 95 - ((platformData.estimatedRank - 1) * 5))
              : 85;
            
            result.platformResults.push({
              platform: platformName,
              score: Math.round(baseScore),
              rank: platformData.estimatedRank,
              model: platformData.model
            });
          });
        }
      }
      
      // Sort the platforms by rank (if available)
      result.platformResults.sort((a, b) => {
        if (a.rank !== undefined && b.rank !== undefined) {
          return a.rank - b.rank;
        }
        if (a.rank !== undefined) return -1;
        if (b.rank !== undefined) return 1;
        return b.score - a.score;
      });
      
      // Log final platform results
      console.log("Final platform results:", JSON.stringify(result.platformResults, null, 2));
      
      // Update overall score based on average of platform scores
      if (result.platformResults.length > 0) {
        const avgScore = result.platformResults.reduce((sum, platform) => sum + platform.score, 0) / result.platformResults.length;
        result.overallScore = Math.round(avgScore);
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
      
      // Use simulated data on error
      const simulatedResponse = await AnalysisService.sendWebhookData({
        businessName,
        location,
        category
      });
      
      const platformResults: PlatformResult[] = [];
      
      if (simulatedResponse && simulatedResponse.platforms) {
        simulatedResponse.platforms.forEach(platformData => {
          const platformName = normalizeModelToPlatform(platformData.model || platformData.platform);
          const baseScore = platformData.estimatedRank 
            ? Math.max(60, 95 - ((platformData.estimatedRank - 1) * 5))
            : 85;
          
          platformResults.push({
            platform: platformName,
            score: Math.round(baseScore),
            rank: platformData.estimatedRank,
            model: platformData.model
          });
        });
      }
      
      // Create error result with simulated data
      const errorResult: AnalysisResult = {
        businessName: businessName || "Your Business",
        location: location || "",
        category: category || "",
        overallScore: platformResults.length > 0 
          ? Math.round(platformResults.reduce((sum, p) => sum + p.score, 0) / platformResults.length)
          : 85,
        platformResults,
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
