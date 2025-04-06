
import { WebhookResponse } from '../types';
import { getPerplexityRanking } from './perplexityService';
import { getMistralRanking } from './mistralService';
import { getDeepSeekRanking } from './deepSeekService';
import { getGeminiRanking } from './geminiService';
import { getOpenAIRanking } from './openaiService';
import { simulatePlatformResponses } from './simulationService';

/**
 * Manager for handling multiple AI platform integrations
 */
export const PlatformServicesManager = {
  /**
   * Gets rankings from all available AI platforms
   */
  getAllPlatformRankings: async (businessData: any): Promise<WebhookResponse> => {
    console.log("🔄 [PlatformManager] Getting rankings from all platforms");
    
    // Try all platforms in parallel
    const [perplexityResponse, mistralResponse, deepseekResponse, geminiResponse, openaiResponse] = await Promise.all([
      getPerplexityRanking(businessData).catch(() => null),
      getMistralRanking(businessData).catch(() => null),
      getDeepSeekRanking(businessData).catch(() => null),
      getGeminiRanking(businessData).catch(() => null),
      getOpenAIRanking(businessData).catch(() => null)
    ]);
    
    // Keep track of successful platforms
    let successfulPlatforms: string[] = [];
    let allPlatforms = [];
    
    // Collect all platform results
    if (perplexityResponse && perplexityResponse.platforms && perplexityResponse.platforms.length > 0) {
      allPlatforms.push(...perplexityResponse.platforms);
      successfulPlatforms.push("Perplexity");
    }
    
    if (mistralResponse && mistralResponse.platforms && mistralResponse.platforms.length > 0) {
      allPlatforms.push(...mistralResponse.platforms);
      successfulPlatforms.push("Mistral");
    }
    
    if (deepseekResponse && deepseekResponse.platforms && deepseekResponse.platforms.length > 0) {
      allPlatforms.push(...deepseekResponse.platforms);
      successfulPlatforms.push("DeepSeek");
    }
    
    if (geminiResponse && geminiResponse.platforms && geminiResponse.platforms.length > 0) {
      allPlatforms.push(...geminiResponse.platforms);
      successfulPlatforms.push("Gemini");
    }
    
    if (openaiResponse && openaiResponse.platforms && openaiResponse.platforms.length > 0) {
      allPlatforms.push(...openaiResponse.platforms);
      successfulPlatforms.push("OpenAI");
    }
    
    // If we have at least one successful platform
    if (allPlatforms.length > 0) {
      console.log(`✅ [PlatformManager] Retrieved rankings from ${successfulPlatforms.join(", ")}`);
      
      // For platforms that failed, get simulated results
      if (successfulPlatforms.length < 5) {
        const simulatedResponse = await simulatePlatformResponses(businessData);
        
        // Filter out already successful platforms from simulated results
        const remainingPlatforms = simulatedResponse.platforms?.filter(
          p => !successfulPlatforms.includes(p.platform || "")
        ) || [];
        
        // Add simulated results for missing platforms
        if (remainingPlatforms.length > 0) {
          console.log(`🔮 [PlatformManager] Adding simulated results for missing platforms`);
          allPlatforms.push(...remainingPlatforms);
        }
      }
      
      // Return the combined results
      return {
        platforms: allPlatforms,
        status: "success",
        message: `Retrieved rankings from ${successfulPlatforms.join(", ")}`,
        timestamp: new Date().toISOString()
      };
    }
    
    // All platforms failed, use simulated responses
    console.log("⚠️ [PlatformManager] All platforms failed, using simulated responses");
    return await simulatePlatformResponses(businessData);
  }
};
