
import { ApifyBusinessResult } from "@/services/types";

export interface ProfileField {
  name: string;
  isComplete: boolean;
  value?: string;
  importance: 'high' | 'medium' | 'low';
}

export interface ProfileCompleteness {
  overallScore: number;
  fields: ProfileField[];
  missingFields: string[];
  completedFields: string[];
}

/**
 * Calculates the completeness of a Google Business Profile
 */
export const calculateProfileCompleteness = (business: ApifyBusinessResult | null): ProfileCompleteness => {
  if (!business) {
    return {
      overallScore: 0,
      fields: [],
      missingFields: ['name', 'address', 'phone', 'website', 'category', 'claimStatus'],
      completedFields: []
    };
  }
  
  // Define all required fields with their importance
  const fields: ProfileField[] = [
    { 
      name: 'name', 
      isComplete: !!business.name && business.name !== 'Unknown', 
      value: business.name,
      importance: 'high'
    },
    { 
      name: 'address', 
      isComplete: !!business.address, 
      value: business.address,
      importance: 'high'
    },
    { 
      name: 'phone', 
      isComplete: !!business.phoneNumber, 
      value: business.phoneNumber,
      importance: 'high'
    },
    { 
      name: 'website', 
      isComplete: !!business.website, 
      value: business.website,
      importance: 'medium'
    },
    { 
      name: 'category', 
      isComplete: !!business.category, 
      value: business.category,
      importance: 'high'
    },
    { 
      name: 'claimStatus', 
      isComplete: business.isClaimed !== undefined, 
      value: business.isClaimed ? 'Claimed' : 'Unclaimed',
      importance: 'medium'
    },
  ];
  
  // Count completed fields
  const completedFields = fields.filter(field => field.isComplete).map(field => field.name);
  const missingFields = fields.filter(field => !field.isComplete).map(field => field.name);
  
  // Calculate weighted score
  let totalWeight = 0;
  let earnedWeight = 0;
  
  fields.forEach(field => {
    const weight = field.importance === 'high' ? 2 : field.importance === 'medium' ? 1 : 0.5;
    totalWeight += weight;
    if (field.isComplete) earnedWeight += weight;
  });
  
  const overallScore = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
  
  return {
    overallScore,
    fields,
    missingFields,
    completedFields
  };
};
