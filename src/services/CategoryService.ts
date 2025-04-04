
import { BusinessCategory } from './types';

export const CategoryService = {
  detectCategory: async (businessName: string): Promise<BusinessCategory[]> => {
    console.log(`Detecting category for: ${businessName}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock categories based on business name
    const categories = [
      {
        name: businessName.toLowerCase().includes('cafe') 
          ? 'Cafe' 
          : businessName.toLowerCase().includes('restaurant')
            ? 'Restaurant'
            : businessName.toLowerCase().includes('tech')
              ? 'Technology'
              : 'Retail',
        confidence: 0.87
      },
      {
        name: 'Local Business',
        confidence: 0.65
      }
    ];
    
    return categories;
  }
};
