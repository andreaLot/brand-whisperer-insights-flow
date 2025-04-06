
import { WebhookResponse } from '../types';
import { normalizeModelToPlatform } from './platformUtils';
import { processMultiplePlatformResponse } from './responseProcessor';
import { sendWithNoCors } from './fallbackService';
import { simulatePlatformResponses } from './simulationService';

export const WebhookService = {
  normalizeModelToPlatform,
  
  sendWebhookData: async (businessData: any): Promise<WebhookResponse | null> => {
    const webhookUrl = "https://uberall.app.n8n.cloud/webhook-test/analyze-business-ranking";
    
    try {
      console.log(`Sending detailed data to webhook: ${JSON.stringify(businessData)}`);
      
      // Use fetch and allow CORS response to be processed
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...businessData,
          timestamp: new Date().toISOString(),
          source: "Brand Whisperer Analysis Tool",
        }),
      });
      
      console.log("Webhook request sent, processing response");
      
      // Process the response
      if (response.ok) {
        try {
          const rawResponseData = await response.json();
          console.log("🔍 [WebhookService] Raw webhook response received:", 
                      JSON.stringify(rawResponseData, null, 2));
          
          // Handle array of results (multiple platforms)
          if (Array.isArray(rawResponseData)) {
            console.log(`🔍 [WebhookService] Detected array response with ${rawResponseData.length} platform results`);
            return processMultiplePlatformResponse(rawResponseData);
          }
          
          // Extract data from OpenAI format for single response
          if (rawResponseData.choices && rawResponseData.choices.length > 0) {
            const content = rawResponseData.choices[0].message?.content;
            const model = rawResponseData.model;
            
            console.log(`🔍 [WebhookService] Detected OpenAI response format with model: ${model}`);
            
            // Extract rank from content (e.g. "Estimated Rank: 3")
            let estimatedRank: number | undefined;
            if (content) {
              const rankMatch = content.match(/Estimated Rank:\s*(\d+)/i);
              if (rankMatch && rankMatch[1]) {
                estimatedRank = parseInt(rankMatch[1], 10);
                console.log(`🔍 [WebhookService] Extracted rank from content: ${estimatedRank}`);
              }
            }
            
            // Normalize the model to platform
            const platform = normalizeModelToPlatform(model);
            
            // Create a response with platforms array
            return {
              platforms: [{
                platform,
                model: model || platform,
                estimatedRank: estimatedRank || 1
              }],
              estimatedRank,
              model,
              platform,
              status: "success",
              message: content || "Analysis complete",
              timestamp: new Date().toISOString()
            };
          }
          
          // Fallback to the old format if OpenAI format is not detected
          // Convert old format to include platforms array
          if (rawResponseData.estimatedRank && (rawResponseData.model || rawResponseData.platform)) {
            console.log(`🔍 [WebhookService] Detected legacy format with estimatedRank: ${rawResponseData.estimatedRank}`);
            const platform = rawResponseData.platform || normalizeModelToPlatform(rawResponseData.model);
            return {
              ...rawResponseData,
              platforms: [{
                platform,
                model: rawResponseData.model || platform,
                estimatedRank: rawResponseData.estimatedRank
              }]
            };
          }
          
          console.log("🔍 [WebhookService] Returning raw response data as is");
          return rawResponseData as WebhookResponse;
        } catch (parseError) {
          console.error("❌ [WebhookService] Webhook responded but couldn't parse JSON:", parseError);
          return { 
            status: "received", 
            message: "Response received but couldn't be parsed",
            platforms: [] 
          };
        }
      } else {
        console.error("❌ [WebhookService] Webhook response not OK:", response.status, response.statusText);
        
        // Fall back to no-cors mode if we get a CORS error
        return await sendWithNoCors(businessData, webhookUrl);
      }
    } catch (error) {
      console.error("❌ [WebhookService] Error sending webhook data:", error);
      
      // Try alternative approaches
      return await sendWithNoCors(businessData, webhookUrl);
    }
  }
};
