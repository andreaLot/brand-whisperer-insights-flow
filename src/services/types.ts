
export interface BusinessCategory {
  name: string;
  confidence: number;
}

export interface PlatformResult {
  platform?: string;
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
  rating?: number; // Added rating property
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
  phoneNumber?: string;
  reviews?: ApifyReview[];
  images?: string[];
  photos?: string[]; // Added photos property
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

// Updated WebhookResponse type to include multiple platforms
export interface PlatformRanking {
  platform: string;
  model: string;
  estimatedRank: number;
  score?: number;
}

export interface WebhookResponse {
  platforms?: PlatformRanking[];
  estimatedRank?: number;
  confidence?: number;
  message?: string;
  status?: string;
  timestamp?: string;
  model?: string;
  platform?: string;
}
