import { StrengthCategory } from "./BrandService";

export interface WebhookResponse {
  model?: string;
  platforms?: PlatformWebhookResult[];
  estimatedRank?: number;
  message?: string;
  status?: string;
  timestamp?: string;
}

export interface PlatformWebhookResult {
  platform?: string;
  model?: string;
  estimatedRank?: number;
  relevanceScore?: number;
}

export interface ApifyBusinessResult {
  name: string;
  rating?: number;
  reviewsCount?: number;
  address?: string;
  category?: string;
  website?: string;
  reviews: ApifyReview[];
  images: string[];
  phoneNumber?: string;
  isClaimed?: boolean;
}

export interface ApifyReview {
  text: string;
  stars: number;
  publishedAtDate?: string;
  userName?: string;
}

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

export interface PlatformRanking {
  platform: string;
  model: string;
  estimatedRank: number;
  score?: number;
}
