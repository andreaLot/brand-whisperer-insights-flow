
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { WebhookService, WebhookResponse } from '@/services/WebhookService';
import { PlaceSelectionResult } from '@/hooks/useGooglePlaces';

export const useWebhook = () => {
  const { toast } = useToast();
  const [webhookSent, setWebhookSent] = useState(false);
  const [webhookAttempts, setWebhookAttempts] = useState(0);
  const [webhookResponse, setWebhookResponse] = useState<WebhookResponse | null>(null);

  const sendWebhookData = async (name: string, loc: string, cat: string, placeData?: PlaceSelectionResult) => {
    if (name && loc) {
      console.log("Sending webhook data with all place details");
      setWebhookAttempts(prev => prev + 1);
      
      const webhookData = {
        businessName: name,
        location: loc,
        category: cat,
        ...(placeData || {})
      };
      
      const response = await WebhookService.sendWebhookData(webhookData);
      
      if (response) {
        console.log("Webhook data sent and response received:", response);
        setWebhookSent(true);
        setWebhookResponse(response);
        
        // Show a toast notification if we got estimated rank data
        if (response.estimatedRank) {
          toast({
            title: "Rank Estimate Received",
            description: `Your business has an estimated rank of #${response.estimatedRank} ${response.model ? `(via ${response.model})` : ''}`,
          });
        }
      } else {
        console.warn("Failed to send webhook data or receive response");
      }
    }
  };

  useEffect(() => {
    let retryTimer: NodeJS.Timeout | null = null;
    
    if (!webhookSent && webhookAttempts > 0 && webhookAttempts < 5) {
      retryTimer = setTimeout(() => {
        console.log(`Retry attempt ${webhookAttempts + 1} to send webhook data`);
      }, 3000); // Retry every 3 seconds, up to 5 times
    }
    
    return () => {
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [webhookSent, webhookAttempts]);

  return {
    webhookSent,
    webhookResponse,
    sendWebhookData
  };
};
