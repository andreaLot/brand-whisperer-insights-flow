
export interface BusinessCategory {
  name: string;
  confidence: number;
}

export interface PlatformResult {
  platform: string;
  score: number;
  rank?: number;
  details?: string[];
  model?: string;
}

export interface AnalysisResult {
  businessName: string;
  location: string;
  category: string;
  overallScore: number;
  platformResults: PlatformResult[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  model?: string;
}

export interface ApifyReview {
  text: string;
  stars: number;
  publishedAtDate?: string;
  userName?: string;
}

export interface ApifyBusinessResult {
  name: string;
  rating?: number;
  reviewsCount?: number;
  address?: string;
  category?: string;
  website?: string;
  reviews?: ApifyReview[];
  images?: string[];
}

export interface ApifyCategoryResult {
  name: string;
  rating?: number;
  reviewsCount?: number;
  address?: string;
  category?: string;
  website?: string;
  reviews?: ApifyReview[];
  images?: string[];
}
