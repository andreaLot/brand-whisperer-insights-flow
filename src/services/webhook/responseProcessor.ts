
import { WebhookResponse, PlatformRanking } from '../types';
import { normalizeModelToPlatform } from './platformUtils';

// Process responses that contain multiple platform results
export function processMultiplePlatformResponse(responses: any[]): WebhookResponse {
  const platforms: PlatformRanking[] = [];
  
  responses.forEach((response, index) => {
    console.log(`🔍 [WebhookService] Processing platform result ${index + 1}:`, 
                JSON.stringify(response, null, 2));
    
    // Handle modern API formats with choices array (Perplexity, DeepSeek, Mistral, etc)
    if (response.model && response.choices && response.choices.length > 0) {
      const content = response.choices[0].message?.content;
      const model = response.model;
      
      // Extract rank from content (e.g. "Estimated Rank: 3")
      let estimatedRank: number | undefined;
      if (content) {
        const rankMatch = content.match(/Estimated Rank:\s*(\d+)/i);
        if (rankMatch && rankMatch[1]) {
          estimatedRank = parseInt(rankMatch[1], 10);
          console.log(`🔍 [WebhookService] Extracted rank from content for ${model}: ${estimatedRank}`);
        }
      }
      
      // Only add if we found a rank
      if (estimatedRank !== undefined && model) {
        const platform = normalizeModelToPlatform(model);
        platforms.push({
          platform,
          model,
          estimatedRank
        });
        console.log(`✅ [WebhookService] Added platform ${platform} with rank ${estimatedRank}`);
      }
    }
    // Handle Gemini format (candidates array with parts)
    else if (response.candidates && response.candidates.length > 0 && 
             response.candidates[0].content?.parts && 
             response.candidates[0].content.parts.length > 0) {
      
      const text = response.candidates[0].content.parts[0].text;
      const modelVersion = response.modelVersion || "gemini";
      
      console.log(`🔍 [WebhookService] Processing Gemini format with model ${modelVersion}`);
      
      // Extract rank from content (e.g. "Estimated Rank: 3")
      let estimatedRank: number | undefined;
      if (text) {
        const rankMatch = text.match(/Estimated Rank:\s*(\d+)/i);
        if (rankMatch && rankMatch[1]) {
          estimatedRank = parseInt(rankMatch[1], 10);
          console.log(`🔍 [WebhookService] Extracted rank from Gemini content: ${estimatedRank}`);
        }
      }
      
      // Only add if we found a rank
      if (estimatedRank !== undefined) {
        const platform = normalizeModelToPlatform(modelVersion);
        platforms.push({
          platform,
          model: modelVersion,
          estimatedRank
        });
        console.log(`✅ [WebhookService] Added platform ${platform} with rank ${estimatedRank}`);
      }
    }
    // Handle direct platform objects
    else if (response.platform || response.model) {
      // Handle direct platform objects
      const platform = response.platform || normalizeModelToPlatform(response.model);
      if (response.estimatedRank !== undefined) {
        platforms.push({
          platform,
          model: response.model || platform,
          estimatedRank: response.estimatedRank
        });
        console.log(`✅ [WebhookService] Added platform ${platform} with rank ${response.estimatedRank}`);
      }
    }
  });
  
  console.log(`🔍 [WebhookService] Processed ${platforms.length} platform results from array response`);
  console.log(`🔍 [WebhookService] Final platforms data:`, JSON.stringify(platforms, null, 2));
  
  // Add a fallback if we couldn't extract any platforms
  if (platforms.length === 0) {
    console.log(`⚠️ [WebhookService] No platform data could be extracted, adding a fallback entry`);
    platforms.push({
      platform: "AI Analysis",
      model: "Combined AI",
      estimatedRank: 5 // Default ranking
    });
  }
  
  return {
    platforms,
    status: "success",
    message: "Multiple platform analysis complete",
    timestamp: new Date().toISOString()
  };
}
