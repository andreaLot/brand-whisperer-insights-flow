
export const WebhookService = {
  sendWebhookData: async (businessData: { businessName: string; location: string; category: string }): Promise<boolean> => {
    const webhookUrl = "https://uberall.app.n8n.cloud/webhook-test/119e2c76-8983-4009-8438-ef722061a28d";
    
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
