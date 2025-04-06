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
      
      if (!result.platformResults) {
        result.platformResults = [];
      }
      
      if (webhookResponse) {
        console.log("Processing webhook data for platform results:", JSON.stringify(webhookResponse, null, 2));
        
        result.platformResults = [];
        
        if (webhookResponse.platforms && webhookResponse.platforms.length > 0) {
          console.log(`Found ${webhookResponse.platforms.length} platforms in webhook response`);
          
          webhookResponse.platforms.forEach(platformData => {
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
            
            console.log(`Added platform ${platformName} with rank ${platformData.estimatedRank} from webhook`);
          });
        } 
        else if (webhookResponse.model || webhookResponse.platform) {
          if (webhookResponse.model) {
            result = {
              ...result,
              model: webhookResponse.model
            };
            
            const platformName = normalizeModelToPlatform(webhookResponse.model);
            console.log(`Normalized model ${webhookResponse.model} to platform ${platformName}`);
            
            const baseScore = webhookResponse.estimatedRank 
              ? Math.max(60, 95 - ((webhookResponse.estimatedRank - 1) * 5))
              : 85;
            
            result.platformResults.push({
              platform: platformName,
              score: Math.round(baseScore),
              rank: webhookResponse.estimatedRank,
              model: webhookResponse.model
            });
            
            console.log(`Added platform ${platformName} with rank ${webhookResponse.estimatedRank} from webhook`);
          }
        }
      }
      
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
      
      result.platformResults.sort((a, b) => {
        if (a.rank !== undefined && b.rank !== undefined) {
          return a.rank - b.rank;
        }
        if (a.rank !== undefined) return -1;
        if (b.rank !== undefined) return 1;
        return b.score - a.score;
      });
      
      console.log("Final platform results:", JSON.stringify(result.platformResults, null, 2));
      
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
