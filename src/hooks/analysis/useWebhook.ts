
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { WebhookService } from '@/services/WebhookService';
import { WebhookResponse } from '@/services/types';
import { PlaceSelectionResult } from '@/hooks/useGooglePlaces';

export const useWebhook = () => {
  const { toast } = useToast();
  const [webhookSent, setWebhookSent] = useState(false);
  const [webhookAttempts, setWebhookAttempts] = useState(0);
  const [webhookResponse, setWebhookResponse] = useState<WebhookResponse | null>(null);

  const sendWebhookData = async (name: string, loc: string, cat: string, placeData?: PlaceSelectionResult) => {
    if (name && loc) {
      console.log("Sending webhook data for platform rankings");
      setWebhookAttempts(prev => prev + 1);
      
      const webhookData = {
        businessName: name,
        location: loc,
        category: cat,
        ...(placeData || {})
      };
      
      try {
        const response = await WebhookService.sendWebhookData(webhookData);
        
        if (response) {
          console.log("Webhook data sent and response received:", response);
          setWebhookSent(true);
          setWebhookResponse(response);
          
          // Show a toast notification for platforms
          if (response.platforms && response.platforms.length > 0) {
            // Show toast for the highest-ranking platform
            const topPlatform = response.platforms.sort((a, b) => a.estimatedRank - b.estimatedRank)[0];
            toast({
              title: "Rankings Retrieved",
              description: `${topPlatform.platform} ranks your business at #${topPlatform.estimatedRank}`,
            });
            
            // If we have multiple platforms, show another toast
            if (response.platforms.length > 1) {
              setTimeout(() => {
                toast({
                  title: "Multiple Rankings",
                  description: `Retrieved rankings from ${response.platforms?.length} AI platforms`,
                });
              }, 1500);
            }
          } 
          // Fallback to legacy format
          else if (response.estimatedRank) {
            const platformName = WebhookService.normalizeModelToPlatform(response.model);
            toast({
              title: "Rankings Retrieved",
              description: `${platformName} ranks your business at #${response.estimatedRank}`,
            });
          }
          
          return response;
        } else {
          console.warn("Failed to send webhook data or receive response");
          toast({
            title: "Webhook Error",
            description: "Could not retrieve ranking data. Please try again.",
            variant: "destructive"
          });
          return null;
        }
      } catch (error) {
        console.error("Error in webhook communication:", error);
        toast({
          title: "Error",
          description: "Failed to analyze rankings. Please try again later.",
          variant: "destructive"
        });
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    let retryTimer: NodeJS.Timeout | null = null;
    
    if (!webhookSent && webhookAttempts > 0 && webhookAttempts < 3) {
      retryTimer = setTimeout(() => {
        console.log(`Retry attempt ${webhookAttempts + 1} to send webhook data`);
      }, 3000); // Retry every 3 seconds, up to 3 times
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
