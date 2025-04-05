
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { AnalysisService, ApifyBusinessResult } from "@/services/AnalysisService";

export const useApifyData = () => {
  const { toast } = useToast();
  const [apifyBusinessResult, setApifyBusinessResult] = useState<ApifyBusinessResult | null>(null);
  const [apifyLoading, setApifyLoading] = useState(false);

  const fetchApifyBusinessData = async (business: string, locationValue: string) => {
    setApifyLoading(true);
    
    try {
      const businessResult = await AnalysisService.fetchBusinessFromApify(business, locationValue);
      
      if (businessResult) {
        setApifyBusinessResult(businessResult);
        console.log("Apify business data received:", businessResult);
      }
      
      return businessResult;
    } catch (error) {
      console.error("Error fetching business data from Apify:", error);
      toast({
        title: "API Error",
        description: "Failed to fetch business data from Apify.",
        variant: "destructive"
      });
      return null;
    } finally {
      setApifyLoading(false);
    }
  };
  
  return {
    apifyBusinessResult,
    apifyLoading,
    fetchApifyBusinessData,
  };
};
