
export const WebhookService = {
  sendWebhookData: async (businessData: any): Promise<boolean> => {
    const webhookUrl = "https://uberall.app.n8n.cloud/webhook-test/analyze-business-ranking";
    
    try {
      console.log(`Sending detailed data to webhook: ${JSON.stringify(businessData)}`);
      
      // Try using fetch with CORS mode set to no-cors
      const response = await fetch(webhookUrl, {
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
      
      console.log("Webhook request sent");
      
      // With no-cors mode, we can't access response status, so we assume success
      return true;
    } catch (error) {
      console.error("Error sending webhook data:", error);
      
      // Try alternative approach with img ping as fallback (commonly used for tracking pixels)
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
        return true;
      } catch (fallbackError) {
        console.error("Fallback method also failed:", fallbackError);
        return false;
      }
    }
  }
};
