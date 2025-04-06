
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { AnalysisService, ApifyBusinessResult, ApifyCategoryResult } from "@/services/AnalysisService";

export const useApifyData = () => {
  const { toast } = useToast();
  const [apifyBusinessResult, setApifyBusinessResult] = useState<ApifyBusinessResult | null>(null);
  const [apifyCategoryResults, setApifyCategoryResults] = useState<ApifyCategoryResult[]>([]);
  const [apifyLoading, setApifyLoading] = useState(false);

  const fetchApifyBusinessData = async (business: string, locationValue: string) => {
    setApifyLoading(true);
    
    try {
      const businessResult = await AnalysisService.fetchBusinessFromApify(business, locationValue);
      
      if (businessResult) {
        setApifyBusinessResult(businessResult);
        console.log("Apify business data received:", businessResult);
        
        // Get competitor results from global cache
        const competitors = (window as any).apifyCategoryResults || [];
        if (competitors.length > 0) {
          setApifyCategoryResults(competitors);
          console.log("Apify competitor data received from cache:", competitors);
        }
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
    apifyCategoryResults,
    apifyLoading,
    fetchApifyBusinessData,
  };
};
