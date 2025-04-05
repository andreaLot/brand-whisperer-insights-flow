
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
  
  const fetchApifyCategoryData = async (categoryValue: string, city: string) => {
    setApifyLoading(true);
    
    try {
      const query = `${categoryValue} ${city}`;
      console.log("Fetching category data with query:", query);
      
      const categoryResults = await AnalysisService.fetchCategoryFromApify(categoryValue, city);
      
      if (Array.isArray(categoryResults)) {
        setApifyCategoryResults(categoryResults);
        console.log("Apify category data received:", categoryResults);
      }
      
      return categoryResults;
    } catch (error) {
      console.error("Error fetching category data from Apify:", error);
      toast({
        title: "API Error",
        description: "Failed to fetch category data from Apify.",
        variant: "destructive"
      });
      return [];
    } finally {
      setApifyLoading(false);
    }
  };
  
  return {
    apifyBusinessResult,
    apifyCategoryResults,
    apifyLoading,
    fetchApifyBusinessData,
    fetchApifyCategoryData,
  };
};
