
import { ApifyBusinessResult, ApifyCategoryResult } from './types';

export const ApifyService = {
  fetchBusinessFromApify: async (businessName: string, location: string): Promise<ApifyBusinessResult | null> => {
    console.log(`Fetching business data from Apify for: ${businessName} in ${location}`);
    
    try {
      const response = await fetch("https://api.apify.com/v2/acts/compass~crawler-google-places/runs?token=apify_api_vVFGRJajjdx3IDfdn86ww9hiyIKDGR25Jod1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searchString: `${businessName} ${location}`,
          maxPlaces: 1,
          language: "en",
          maxCrawledPlaces: 1,
          includeReviews: true,
          includeImages: true,
          includePopularTimes: false,
          exportPlaceUrls: false,
          reviewsSort: "newest_first", // Sort by newest first to help with filtering
          reviewsFilterDateFrom: "2025-01-01", // Only collect reviews from 2025 onwards
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Apify business run started:", data);
      
      // Get the run ID to check results later
      const runId = data.data.id;
      
      // Wait for the run to complete (poll the status)
      const result = await ApifyService.pollApifyRunStatus(runId);
      
      if (result && result.items && result.items.length > 0) {
        const place = result.items[0];
        
        // Filter reviews to only include those from 2025 onwards
        const filteredReviews = place.reviews ? place.reviews.filter((review: any) => {
          const reviewDate = review.publishedAtDate ? new Date(review.publishedAtDate) : null;
          return reviewDate && reviewDate.getFullYear() >= 2025;
        }) : [];
        
        return {
          name: place.name || businessName,
          rating: place.rating,
          reviewsCount: place.reviewsCount,
          address: place.address,
          category: place.category,
          website: place.website,
          reviews: filteredReviews,
          images: place.imageUrls || []
        };
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching business from Apify:", error);
      return null;
    }
  },
  
  fetchCategoryFromApify: async (category: string, location: string): Promise<ApifyCategoryResult[]> => {
    // Format the query as "Category City" (e.g., "Data recovery service Austin")
    const searchQuery = `${category} ${location}`;
    console.log(`Fetching category data from Apify with query: ${searchQuery}`);
    
    try {
      const response = await fetch("https://api.apify.com/v2/acts/compass~crawler-google-places/runs?token=apify_api_vVFGRJajjdx3IDfdn86ww9hiyIKDGR25Jod1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searchString: searchQuery,
          maxPlaces: 3,
          language: "en",
          maxCrawledPlaces: 3,
          includeReviews: true,
          includeImages: true,
          includePopularTimes: false,
          exportPlaceUrls: false,
          reviewsSort: "newest_first", // Sort by newest first
          reviewsFilterDateFrom: "2025-01-01", // Only collect reviews from 2025 onwards
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Apify category run started:", data);
      
      // Get the run ID to check results later
      const runId = data.data.id;
      
      // Wait for the run to complete (poll the status)
      const result = await ApifyService.pollApifyRunStatus(runId);
      
      if (result && result.items && result.items.length > 0) {
        return result.items.slice(0, 3).map((place: any) => {
          // Filter reviews to only include those from 2025 onwards
          const filteredReviews = place.reviews ? place.reviews.filter((review: any) => {
            const reviewDate = review.publishedAtDate ? new Date(review.publishedAtDate) : null;
            return reviewDate && reviewDate.getFullYear() >= 2025;
          }) : [];
          
          return {
            name: place.name || "Unknown",
            rating: place.rating,
            reviewsCount: place.reviewsCount,
            address: place.address,
            category: place.category,
            website: place.website,
            reviews: filteredReviews,
            images: place.imageUrls || []
          };
        });
      }
      
      return [];
    } catch (error) {
      console.error("Error fetching category from Apify:", error);
      return [];
    }
  },
  
  pollApifyRunStatus: async (runId: string): Promise<any> => {
    const maxAttempts = 10;
    const pollingInterval = 5000; // 5 seconds
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        // Check the run status
        const statusResponse = await fetch(`https://api.apify.com/v2/acts/compass~crawler-google-places/runs/${runId}?token=apify_api_vVFGRJajjdx3IDfdn86ww9hiyIKDGR25Jod1`);
        
        if (!statusResponse.ok) {
          throw new Error(`Status check failed with status ${statusResponse.status}`);
        }
        
        const statusData = await statusResponse.json();
        console.log(`Apify run status (attempt ${attempt + 1}):`, statusData.data.status);
        
        // If the run is finished, get the dataset items
        if (statusData.data.status === "SUCCEEDED") {
          const datasetId = statusData.data.defaultDatasetId;
          const itemsResponse = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=apify_api_vVFGRJajjdx3IDfdn86ww9hiyIKDGR25Jod1`);
          
          if (!itemsResponse.ok) {
            throw new Error(`Items fetch failed with status ${itemsResponse.status}`);
          }
          
          const itemsData = await itemsResponse.json();
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
};
