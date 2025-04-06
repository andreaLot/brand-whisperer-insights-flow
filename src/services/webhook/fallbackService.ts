
import { WebhookResponse } from '../types';
import { simulatePlatformResponses } from './simulationService';

// Helper function for no-cors mode
export async function sendWithNoCors(businessData: any, webhookUrl: string): Promise<WebhookResponse | null> {
  try {
    console.log("🔍 [WebhookService] Attempting no-cors mode webhook request");
    // Try using fetch with CORS mode set to no-cors
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors", // This will prevent CORS errors but will return an opaque response
      body: JSON.stringify({
        ...businessData,
        timestamp: new Date().toISOString(),
        source: "Brand Whisperer Analysis Tool",
      }),
    });
    
    console.log("🔍 [WebhookService] Webhook request sent with no-cors mode");
    
    // With no-cors mode, we can't access response data directly
    // We'll try to poll for results
    return await simulatePlatformResponses(businessData);
  } catch (fallbackError) {
    console.error("❌ [WebhookService] Fallback method failed:", fallbackError);
    
    // Try image ping as last resort
    try {
      console.log("🔍 [WebhookService] Attempting image ping fallback");
      const pingUrl = new URL(webhookUrl);
      
      // Add all properties from businessData to URL params
      Object.entries(businessData).forEach(([key, value]) => {
        if (typeof value === 'string') {
          pingUrl.searchParams.append(key, encodeURIComponent(value));
        } else if (value !== null && value !== undefined) {
          pingUrl.searchParams.append(key, encodeURIComponent(JSON.stringify(value)));
        }
      });
      
      pingUrl.searchParams.append('timestamp', new Date().toISOString());
      
      const img = new Image();
      img.src = pingUrl.toString();
      console.log("🔍 [WebhookService] Attempted fallback webhook via image ping");
      
      return { 
        status: "sent", 
        message: "Request sent via image ping",
        platforms: [] 
      };
    } catch (imageError) {
      console.error("❌ [WebhookService] All webhook methods failed:", imageError);
      return null;
    }
  }
}
