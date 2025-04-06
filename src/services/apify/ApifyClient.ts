
import { ApifyConfig } from './types';

/**
 * Client that handles direct API calls to Apify
 */
export class ApifyClient {
  private readonly apiToken: string;
  
  constructor(apiToken: string = 'apify_api_vVFGRJajjdx3IDfdn86ww9hiyIKDGR25Jod1') {
    this.apiToken = apiToken;
  }
  
  /**
   * Starts a new Google Places crawler run on Apify
   */
  async startGooglePlacesCrawl(config: ApifyConfig): Promise<{ data: { id: string } }> {
    console.log(`Starting Apify Google Places crawl for: ${config.searchString}`);
    
    const response = await fetch(`https://api.apify.com/v2/acts/compass~crawler-google-places/runs?token=${this.apiToken}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
    });
    
    if (!response.ok) {
      throw new Error(`Apify API request failed with status ${response.status}`);
    }
    
    return await response.json();
  }
  
  /**
   * Checks the status of an Apify run
   */
  async checkRunStatus(runId: string): Promise<{ data: { status: string, defaultDatasetId: string } }> {
    const response = await fetch(`https://api.apify.com/v2/acts/compass~crawler-google-places/runs/${runId}?token=${this.apiToken}`);
    
    if (!response.ok) {
      throw new Error(`Status check failed with status ${response.status}`);
    }
    
    return await response.json();
  }
  
  /**
   * Fetches items from an Apify dataset
   */
  async fetchDatasetItems(datasetId: string): Promise<any[]> {
    const response = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${this.apiToken}`);
    
    if (!response.ok) {
      throw new Error(`Items fetch failed with status ${response.status}`);
    }
    
    return await response.json();
  }
}
