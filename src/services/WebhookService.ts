
export const WebhookService = {
  sendWebhookData: async (businessData: { businessName: string; location: string; category: string }): Promise<boolean> => {
    const webhookUrl = "https://uberall.app.n8n.cloud/webhook-test/90433a9c-3123-494e-a533-b6a3a0b84da1";
    
    try {
      console.log(`Sending data to webhook: ${JSON.stringify(businessData)}`);
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors", // Handle CORS restrictions
        body: JSON.stringify({
          ...businessData,
          timestamp: new Date().toISOString(),
          source: "Brand Whisperer Analysis Tool",
        }),
      });
      
      console.log("Webhook request sent");
      return true; // We assume success with no-cors mode
    } catch (error) {
      console.error("Error sending webhook data:", error);
      return false;
    }
  }
};
