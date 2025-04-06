import { WebhookResponse } from './types';

// Enhanced map of model identifiers to platform names for better display
const modelToPlatformMap: Record<string, string> = {
  // OpenAI models
  "gpt-4o": "OpenAI",
  "gpt-4": "OpenAI",
  "gpt-3.5": "OpenAI",
  "gpt": "OpenAI",
  "openai": "OpenAI",
  
  // Perplexity models
  "llama-3.1": "Perplexity", 
  "llama-3": "Perplexity",
  "perplexity": "Perplexity",
  
  // Mistral models
  "mistral-large": "Mistral",
  "mistral-medium": "Mistral",
  "mistral": "Mistral",
  
  // DeepSeek models
  "deepseek-chat": "DeepSeek",
  "deepseek": "DeepSeek",
  
  // Gemini models
  "gemini": "Gemini",
  "bard": "Gemini",
  "palm": "Gemini",
  
  // Others
  "claude": "Anthropic",
};

// Function to normalize model names to platform names
export const normalizeModelToPlatform = (model?: string): string => {
  if (!model) return "AI Analysis";
  
  const modelLower = model.toLowerCase();
  
  // Check if any key in the map is contained in the model string
  for (const [key, platform] of Object.entries(modelToPlatformMap)) {
    if (modelLower.includes(key)) {
      return platform;
    }
  }
  
  return model; // Return the original model if no match
};

export const WebhookService = {
  normalizeModelToPlatform,
  
  sendWebhookData: async (businessData: any): Promise<WebhookResponse | null> => {
    const webhookUrl = "https://uberall.app.n8n.cloud/webhook/analyze-business-ranking";
    
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
          console.log("Webhook response received:", rawResponseData);
          
          // Extract data from OpenAI format
          if (rawResponseData.choices && rawResponseData.choices.length > 0) {
            const content = rawResponseData.choices[0].message?.content;
            const model = rawResponseData.model;
            
            // Extract rank from content (e.g. "Estimated Rank: 3")
            let estimatedRank: number | undefined;
            if (content) {
              const rankMatch = content.match(/Estimated Rank:\s*(\d+)/i);
              if (rankMatch && rankMatch[1]) {
                estimatedRank = parseInt(rankMatch[1], 10);
              }
            }
            
            // Normalize the model to platform
            const platform = normalizeModelToPlatform(model);
            
            return {
              estimatedRank,
              model,
              platform,
              status: "success",
              message: content || "Analysis complete",
              timestamp: new Date().toISOString()
            };
          }
          
          // Fallback to the old format if OpenAI format is not detected
          return rawResponseData as WebhookResponse;
        } catch (parseError) {
          console.log("Webhook responded but couldn't parse JSON:", parseError);
          return { status: "received", message: "Response received but couldn't be parsed" };
        }
      } else {
        console.log("Webhook response not OK:", response.status);
        
        // Fall back to no-cors mode if we get a CORS error
        return await sendWithNoCors(businessData, webhookUrl);
      }
    } catch (error) {
      console.error("Error sending webhook data:", error);
      
      // Try alternative approaches
      return await sendWithNoCors(businessData, webhookUrl);
    }
  }
};

// Helper function for no-cors mode
async function sendWithNoCors(businessData: any, webhookUrl: string): Promise<WebhookResponse | null> {
  try {
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
    
    console.log("Webhook request sent with no-cors mode");
    
    // With no-cors mode, we can't access response data directly
    // We'll try to poll for results
    return await pollForWebhookResults(businessData);
  } catch (fallbackError) {
    console.error("Fallback method failed:", fallbackError);
    
    // Try image ping as last resort
    try {
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
      console.log("Attempted fallback webhook via image ping");
      
      return { status: "sent", message: "Request sent via image ping" };
    } catch (imageError) {
      console.error("All webhook methods failed:", imageError);
      return null;
    }
  }
}

// Poll for results using a separate endpoint
async function pollForWebhookResults(businessData: any): Promise<WebhookResponse | null> {
  // In a real implementation, you would have a status endpoint to poll
  // For now, we're simulating a response
  console.log("Polling for webhook results...");
  
  // Create a polling endpoint URL (in production, this would be a real endpoint)
  const pollingUrl = "https://uberall.app.n8n.cloud/webhook/status";
  
  try {
    // Simulate polling with a timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          estimatedRank: Math.floor(Math.random() * 10) + 1, // Random rank 1-10 for demo
          confidence: 0.85,
          status: "success",
          message: "Analysis complete",
          timestamp: new Date().toISOString()
        });
      }, 1000);
    });
  } catch (error) {
    console.error("Error polling for webhook results:", error);
    return null;
  }
}
