
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
  // Added new parameters for review filtering
  scrapeReviewsSort?: string;
  scrapeReviewsFilterByDateMin?: string;
  scrapeReviewsFilterByDateMax?: string;
  scrapeReviewsFilterByRating?: string;
  scrapeReviewsFilterByLanguage?: string;
  // Additional fields from the payload
  searchMatching?: string;
  placeMinimumStars?: string;
  website?: string;
  skipClosedPlaces?: boolean;
  scrapePlaceDetailPage?: boolean;
  scrapeTableReservationProvider?: boolean;
  includeWebResults?: boolean;
  scrapeDirectories?: boolean;
  scrapeContacts?: boolean;
  reviewsFilterString?: string;
  reviewsOrigin?: string;
  scrapeReviewsPersonalData?: boolean;
  scrapeImageAuthors?: boolean;
  allPlacesNoSearchAction?: string;
}

export interface ComplexField {
  _type?: string;
  value?: any;
}

export interface ApifyRawResult {
  name: string;
  rating?: number | ComplexField;
  reviewsCount?: number;
  address?: string;
  category?: string | ComplexField;
  website?: string;
  phoneNumber?: string | ComplexField;
  reviews?: Array<{
    text: string;
    stars: number;
    publishedAtDate?: string;
    userName?: string;
  }>;
  imageUrls?: string[];
}
