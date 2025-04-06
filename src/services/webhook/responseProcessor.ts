
import { WebhookResponse, PlatformRanking } from '../types';
import { normalizeModelToPlatform } from './platformUtils';

// Process responses that contain multiple platform results
export function processMultiplePlatformResponse(responses: any[]): WebhookResponse {
  const platforms: PlatformRanking[] = [];
  
  responses.forEach((response, index) => {
    console.log(`🔍 [WebhookService] Processing platform result ${index + 1}:`, 
                JSON.stringify(response, null, 2));
    
    if (response.choices && response.choices.length > 0) {
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
      if (estimatedRank && model) {
        const platform = normalizeModelToPlatform(model);
        platforms.push({
          platform,
          model,
          estimatedRank
        });
        console.log(`✅ [WebhookService] Added platform ${platform} with rank ${estimatedRank}`);
      }
    } else if (response.platform || response.model) {
      // Handle direct platform objects
      const platform = response.platform || normalizeModelToPlatform(response.model);
      if (response.estimatedRank) {
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
  
  return {
    platforms,
    status: "success",
    message: "Multiple platform analysis complete",
    timestamp: new Date().toISOString()
  };
}
