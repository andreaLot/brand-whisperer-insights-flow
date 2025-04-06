
import { ApifyBusinessResult, ApifyReview } from '../types';

export interface ApifyConfig {
  searchString: string;
  maxPlaces: number;
  language: string;
  maxCrawledPlaces: number;
  includeReviews: boolean;
  includeImages: boolean;
  includePopularTimes: boolean;
  exportPlaceUrls: boolean;
  reviewsSort?: string;
  reviewsFilterDateFrom?: string;
}

export interface ApifyRawResult {
  name: string;
  rating?: number;
  reviewsCount?: number;
  address?: string;
  category?: string;
  website?: string;
  reviews?: Array<{
    text: string;
    stars: number;
    publishedAtDate?: string;
    userName?: string;
  }>;
  imageUrls?: string[];
}
