
import { ApifyClient } from './ApifyClient';
import { ApifyDataProcessor } from './ApifyDataProcessor';
import { ApifyConfig } from './types';
import { ApifyBusinessResult } from '../types';

/**
 * Main service that orchestrates Apify operations
 */
export class ApifyService {
  private client: ApifyClient;
  private processor: ApifyDataProcessor;
  
  constructor() {
    this.client = new ApifyClient();
    this.processor = new ApifyDataProcessor();
  }
  
  /**
   * Fetches business data from Apify
   */
  async fetchBusinessFromApify(businessName: string, location: string): Promise<ApifyBusinessResult | null> {
    console.log(`Fetching business data from Apify for: ${businessName} in ${location}`);
    
    try {
      // Construct a very specific search to find exactly the business the user is looking for
      const exactBusinessSearch = businessName.trim() + " " + location.trim();
      console.log("Search query:", exactBusinessSearch);
      
      const config: ApifyConfig = {
        searchString: exactBusinessSearch,
        maxPlaces: 1, // Only fetch the main business
        language: "en",
        maxCrawledPlaces: 1,
        includeReviews: true,
        includeImages: false, // Changed to false as requested
        includePopularTimes: false,
        exportPlaceUrls: false,
        searchMatching: "all",
        placeMinimumStars: "",
        website: "allPlaces",
        skipClosedPlaces: false,
        scrapePlaceDetailPage: false,
        scrapeTableReservationProvider: false,
        includeWebResults: false,
        scrapeDirectories: false,
        scrapeContacts: false,
        reviewsSort: "newest", // Using "newest" instead of "newest_first" to match API requirements
        scrapeReviewsSort: "newest", // Added new parameter
        scrapeReviewsFilterByDateMin: "2024-01-01", // Added new parameter 
        scrapeReviewsFilterByDateMax: "", // Added new parameter
        scrapeReviewsFilterByRating: "", // Added new parameter
        scrapeReviewsFilterByLanguage: "", // Added new parameter
        reviewsFilterString: "",
        reviewsOrigin: "all",
        scrapeReviewsPersonalData: true,
        scrapeImageAuthors: false,
        allPlacesNoSearchAction: ""
      };
      
      // Start the Apify run
      const runData = await this.client.startGooglePlacesCrawl(config);
      const runId = runData.data.id;
      console.log("Apify run started with ID:", runId);
      
      // Poll until the run completes
      const result = await this.pollApifyRunStatus(runId);
      
      if (!result || !result.items || result.items.length === 0) {
        console.log("No places found in Apify results");
        return null;
      }
      
      // Process the first (and only) result
      const place = result.items[0];
      console.log("Place found:", place.name);
      return this.processor.processBusinessResult(place);
    } catch (error) {
      console.error("Error fetching from Apify:", error);
      return null;
    }
  }
  
  /**
   * Polls the Apify run status until it completes or fails
   */
  async pollApifyRunStatus(runId: string): Promise<any> {
    const maxAttempts = 15; // Increase max attempts for slower runs
    const pollingInterval = 5000; // 5 seconds
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        // Check the run status
        const statusData = await this.client.checkRunStatus(runId);
        console.log(`Apify run status (attempt ${attempt + 1}):`, statusData.data.status);
        
        // If the run is finished, get the dataset items
        if (statusData.data.status === "SUCCEEDED") {
          const datasetId = statusData.data.defaultDatasetId;
          const itemsData = await this.client.fetchDatasetItems(datasetId);
          console.log("Apify run results:", itemsData);
          return { items: itemsData };
        }
        
        // If the run failed or timed out
        if (["FAILED", "TIMED-OUT", "ABORTED"].includes(statusData.data.status)) {
          throw new Error(`Apify run ${statusData.data.status.toLowerCase()}`);
        }
        
        // Wait before next polling attempt
        await new Promise(resolve => setTimeout(resolve, pollingInterval));
      } catch (error) {
        console.error(`Error polling Apify run (attempt ${attempt + 1}):`, error);
        
        // For the last attempt, rethrow the error
        if (attempt === maxAttempts - 1) {
          throw error;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, pollingInterval));
      }
    }
    
    throw new Error("Max polling attempts reached");
  }
}

// Export singleton instance
export const apifyService = new ApifyService();
