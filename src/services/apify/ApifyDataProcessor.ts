
import { ApifyBusinessResult, ApifyReview } from '../types';
import { ApifyRawResult } from './types';

export class ApifyDataProcessor {
  /**
   * Processes raw Apify results into a standardized business result
   */
  processBusinessResult(place: ApifyRawResult): ApifyBusinessResult {
    // Filter reviews to only include those from 2025 onwards
    const filteredReviews = this.filterRecentReviews(place.reviews || []);
    
    // Create the business result object
    return {
      name: place.name || "Unknown",
      rating: place.rating,
      reviewsCount: place.reviewsCount,
      address: place.address,
      category: place.category,
      website: place.website,
      reviews: filteredReviews,
      images: place.imageUrls || [],
      phoneNumber: place.phoneNumber || undefined,
      isClaimed: place.ownerVerified
    };
  }
  
  /**
   * Filters reviews to only include those from 2025 onwards
   */
  private filterRecentReviews(reviews: ApifyReview[]): ApifyReview[] {
    return reviews.filter((review) => {
      const reviewDate = review.publishedAtDate ? new Date(review.publishedAtDate) : null;
      return reviewDate && reviewDate.getFullYear() >= 2025;
    });
  }
}
