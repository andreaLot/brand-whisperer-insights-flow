
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { AnalysisService, BusinessCategory } from "@/services/AnalysisService";

export const useCategoryDetection = () => {
  const { toast } = useToast();
  const [primaryCategory, setPrimaryCategory] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState('');
  const [suggestedCategories, setSuggestedCategories] = useState<BusinessCategory[]>([]);

  const detectCategory = async (businessName: string) => {
    try {
      const categories = await AnalysisService.detectCategory(businessName);
      setSuggestedCategories(categories);

      if (categories.length > 0 && !primaryCategory) {
        const detectedCategory = categories[0].name;
        setCategory(detectedCategory);
      }
      
      return categories;
    } catch (error) {
      console.error('Error detecting category:', error);
      toast({
        title: "Error",
        description: "Failed to detect business category. Please try again.",
        variant: "destructive"
      });
      return [];
    }
  };

  return {
    primaryCategory,
    setPrimaryCategory,
    category,
    setCategory,
    suggestedCategories,
    setSuggestedCategories,
    detectCategory
  };
};
