
import { useState } from 'react';
import { AnalysisService, ApifyBusinessResult } from "@/services/AnalysisService";

export const useApifyData = () => {
  const [apifyBusinessResult, setApifyBusinessResult] = useState<ApifyBusinessResult | null>(null);
  const [apifyLoading, setApifyLoading] = useState(false);

  const fetchApifyBusinessData = async (business: string, locationValue: string) => {
    setApifyLoading(true);
    
    try {
      console.log(`Starting Apify search for business: "${business}" at location: "${locationValue}"`);
      const businessResult = await AnalysisService.fetchBusinessFromApify(business, locationValue);
      
      if (businessResult) {
        setApifyBusinessResult(businessResult);
        console.log("Apify business data received:", businessResult);
      } else {
        console.warn("No business found from Apify search");
      }
      
      return businessResult;
    } catch (error) {
      console.error("Error fetching business data from Apify:", error);
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
