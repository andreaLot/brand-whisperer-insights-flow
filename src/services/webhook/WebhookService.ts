
import { WebhookResponse } from '../types';
import { normalizeModelToPlatform } from './platformUtils';
import { processMultiplePlatformResponse } from './responseProcessor';
import { sendWithNoCors } from './fallbackService';
import { simulatePlatformResponses } from './simulationService';

// Define webhook URLs
const PRIMARY_WEBHOOK_URL = "https://uberall.app.n8n.cloud/webhook-test/analyze-business-ranking";
const BACKUP_WEBHOOK_URL = "https://uberall-app.n8n.cloud/webhook-test/analyze-business-ranking"; // Slight variation as backup

export const WebhookService = {
  normalizeModelToPlatform,
  
  sendWebhookData: async (businessData: any): Promise<WebhookResponse | null> => {
    // Try primary URL first
    let response = await tryFetchWebhook(PRIMARY_WEBHOOK_URL, businessData);
    
    // If primary fails, try backup URL
    if (!response && BACKUP_WEBHOOK_URL !== PRIMARY_WEBHOOK_URL) {
      console.log("🔄 [WebhookService] Primary webhook failed, trying backup URL");
      response = await tryFetchWebhook(BACKUP_WEBHOOK_URL, businessData);
    }
    
    // If both fail, fall back to simulation
    if (!response) {
      console.log("🔄 [WebhookService] All webhook attempts failed, using simulated responses");
      return await simulatePlatformResponses(businessData);
    }
    
    return response;
  }
};

// Helper function to try fetching from a webhook URL
async function tryFetchWebhook(webhookUrl: string, businessData: any): Promise<WebhookResponse | null> {
  try {
    console.log(`📤 [WebhookService] Sending data to webhook: ${webhookUrl}`);
    
    // Use fetch with standard CORS handling first
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
    
    console.log("📤 [WebhookService] Request sent, processing response");
    
    // Process the response if successful
    if (response.ok) {
      try {
        const rawResponseData = await response.json();
        console.log("🔍 [WebhookService] Raw webhook response received:", 
                    JSON.stringify(rawResponseData, null, 2));
        
        // Log response to console in formatted way
        console.log("📊 [WebhookService] N8N Response Summary:");
        console.log("--------------------------------------------------");
        
        // Handle array of results (multiple platforms)
        if (Array.isArray(rawResponseData)) {
          console.log(`🔍 [WebhookService] Detected array response with ${rawResponseData.length} platform results`);
          
          rawResponseData.forEach((item, index) => {
            const platform = item.model ? normalizeModelToPlatform(item.model) : 'Unknown Platform';
            console.log(`📌 Platform ${index + 1}: ${platform} (${item.model || 'unknown model'})`);
            
            if (item.choices && item.choices.length > 0) {
              const content = item.choices[0].message?.content;
              console.log(`   Content: ${content}`);
              
              const rankMatch = content?.match(/Estimated Rank:\s*(\d+)/i);
              if (rankMatch && rankMatch[1]) {
                console.log(`   Rank: ${rankMatch[1]}`);
              }
            } else if (item.estimatedRank) {
              console.log(`   Rank: ${item.estimatedRank}`);
            }
          });
          
          console.log("--------------------------------------------------");
          return processMultiplePlatformResponse(rawResponseData);
        }
        
        // Extract data from OpenAI format for single response
        if (rawResponseData.choices && rawResponseData.choices.length > 0) {
          const content = rawResponseData.choices[0].message?.content;
          const model = rawResponseData.model;
          
          console.log(`🔍 [WebhookService] Detected OpenAI response format with model: ${model}`);
          console.log(`📌 Platform: ${normalizeModelToPlatform(model)} (${model})`);
          console.log(`   Content: ${content}`);
          
          // Extract rank from content (e.g. "Estimated Rank: 3")
          let estimatedRank: number | undefined;
          if (content) {
            const rankMatch = content.match(/Estimated Rank:\s*(\d+)/i);
            if (rankMatch && rankMatch[1]) {
              estimatedRank = parseInt(rankMatch[1], 10);
              console.log(`   Rank: ${estimatedRank}`);
            }
          }
          console.log("--------------------------------------------------");
          
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
      // Fall back to no-cors mode
      return await sendWithNoCors(businessData, webhookUrl);
    }
  } catch (error) {
    console.error(`❌ [WebhookService] Error sending webhook data to ${webhookUrl}:`, error);
    // Try no-cors approach
    return await sendWithNoCors(businessData, webhookUrl);
  }
}
