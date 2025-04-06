
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
      const config: ApifyConfig = {
        searchString: `${businessName} ${location}`,
        maxPlaces: 1, // Only fetch the main business
        language: "en",
        maxCrawledPlaces: 1,
        includeReviews: true,
        includeImages: true,
        includePopularTimes: false,
        exportPlaceUrls: false,
        reviewsSort: "newest_first", // Sort by newest first to help with filtering
        reviewsFilterDateFrom: "2025-01-01", // Only collect reviews from 2025 onwards
      };
      
      // Start the Apify run
      const runData = await this.client.startGooglePlacesCrawl(config);
      const runId = runData.data.id;
      
      // Poll until the run completes
      const result = await this.pollApifyRunStatus(runId);
      
      if (!result || !result.items || result.items.length === 0) {
        console.log("No places found in Apify results");
        return null;
      }
      
      // Process the first (and only) result
      const place = result.items[0];
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
    const maxAttempts = 10;
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
