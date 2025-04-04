// This is a mock service that simulates API calls
// In a real application, you would replace these with actual API calls

export interface BusinessCategory {
  name: string;
  confidence: number;
}

export interface PlatformResult {
  platform: string;
  score: number;
  rank?: number;
  details?: string[];
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
}

export interface ApifyBusinessResult {
  name: string;
  rating?: number;
  reviewsCount?: number;
  address?: string;
  category?: string;
  website?: string;
}

export interface ApifyCategoryResult {
  name: string;
  rating?: number;
  reviewsCount?: number;
  address?: string;
  category?: string;
  website?: string;
}

export const AnalysisService = {
  detectCategory: async (businessName: string): Promise<BusinessCategory[]> => {
    console.log(`Detecting category for: ${businessName}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock categories based on business name
    const categories = [
      {
        name: businessName.toLowerCase().includes('cafe') 
          ? 'Cafe' 
          : businessName.toLowerCase().includes('restaurant')
            ? 'Restaurant'
            : businessName.toLowerCase().includes('tech')
              ? 'Technology'
              : 'Retail',
        confidence: 0.87
      },
      {
        name: 'Local Business',
        confidence: 0.65
      }
    ];
    
    return categories;
  },
  
  analyzeBrand: async (businessName: string, location: string, category: string): Promise<AnalysisResult> => {
    console.log(`Analyzing brand: ${businessName} in ${location} (${category})`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Generate some mock data based on the inputs
    const hasGoodName = businessName.length > 5;
    const baseScore = hasGoodName ? 75 : 65;
    
    // Calculate some mock scores
    const perplexityScore = Math.min(100, Math.max(40, baseScore + Math.floor(Math.random() * 15)));
    const geminiScore = Math.min(100, Math.max(40, baseScore - 5 + Math.floor(Math.random() * 20)));
    const grokScore = Math.min(100, Math.max(40, baseScore + 10 + Math.floor(Math.random() * 10) - 10));
    const searchGptScore = Math.min(100, Math.max(40, baseScore - 10 + Math.floor(Math.random() * 15)));
    
    const overallScore = Math.floor((perplexityScore + geminiScore + grokScore + searchGptScore) / 4);
    
    // Mock strengths, weaknesses and recommendations
    const strengths = [];
    const weaknesses = [];
    const recommendations = [];
    
    if (perplexityScore > 70) {
      strengths.push('Strong written content and information architecture.');
    } else {
      weaknesses.push('Limited content depth detected by Perplexity.');
      recommendations.push('Expand your content strategy with in-depth articles about your industry.');
    }
    
    if (geminiScore > 70) {
      strengths.push('Good visibility in Google search results.');
    } else {
      weaknesses.push('Limited visibility in Google search results.');
      recommendations.push('Improve your SEO strategy to increase visibility on Google.');
    }
    
    if (grokScore > 70) {
      strengths.push('Positive sentiment in social media discussions.');
    } else {
      weaknesses.push('Mixed sentiment detected in online conversations.');
      recommendations.push('Engage more with your audience on social platforms to improve sentiment.');
    }
    
    if (searchGptScore > 70) {
      strengths.push('Clear positioning in your market category.');
    } else {
      weaknesses.push('Unclear market positioning compared to competitors.');
      recommendations.push('Refine your unique selling proposition to stand out from competitors.');
    }
    
    // Ensure we have at least some data in each section
    if (strengths.length === 0) {
      strengths.push('Brand name is recognizable and memorable.');
    }
    
    if (weaknesses.length === 0) {
      weaknesses.push('Limited data available for comprehensive analysis.');
    }
    
    if (recommendations.length < 2) {
      recommendations.push('Create more consistent content across all digital channels.');
      recommendations.push('Consider local SEO optimization for better regional visibility.');
    }
    
    return {
      businessName,
      location,
      category,
      overallScore,
      platformResults: [
        {
          platform: 'Perplexity',
          score: perplexityScore,
          rank: Math.floor(Math.random() * 10) + 1
        },
        {
          platform: 'Gemini',
          score: geminiScore,
          rank: Math.floor(Math.random() * 10) + 1
        },
        {
          platform: 'Grok',
          score: grokScore,
          rank: Math.floor(Math.random() * 10) + 1
        },
        {
          platform: 'SearchGPT',
          score: searchGptScore,
          rank: Math.floor(Math.random() * 10) + 1
        }
      ],
      strengths,
      weaknesses,
      recommendations
    };
  },
  
  sendWebhookData: async (businessData: { businessName: string; location: string; category: string }): Promise<boolean> => {
    const webhookUrl = "https://uberall.app.n8n.cloud/webhook-test/90433a9c-3123-494e-a533-b6a3a0b84da1";
    
    try {
      console.log(`Sending data to webhook: ${JSON.stringify(businessData)}`);
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors", // Handle CORS restrictions
        body: JSON.stringify({
          ...businessData,
          timestamp: new Date().toISOString(),
          source: "Brand Whisperer Analysis Tool",
        }),
      });
      
      console.log("Webhook request sent");
      return true; // We assume success with no-cors mode
    } catch (error) {
      console.error("Error sending webhook data:", error);
      return false;
    }
  },
  
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
          includeReviews: false,
          includeImages: false,
          includePopularTimes: false,
          exportPlaceUrls: false,
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
      const result = await AnalysisService.pollApifyRunStatus(runId);
      
      if (result && result.items && result.items.length > 0) {
        const place = result.items[0];
        return {
          name: place.name || businessName,
          rating: place.rating,
          reviewsCount: place.reviewsCount,
          address: place.address,
          category: place.category,
          website: place.website
        };
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching business from Apify:", error);
      return null;
    }
  },
  
  fetchCategoryFromApify: async (category: string, location: string): Promise<ApifyCategoryResult[]> => {
    console.log(`Fetching category data from Apify for: ${category} in ${location}`);
    
    try {
      const response = await fetch("https://api.apify.com/v2/acts/compass~crawler-google-places/runs?token=apify_api_vVFGRJajjdx3IDfdn86ww9hiyIKDGR25Jod1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searchString: `${category} in ${location}`,
          maxPlaces: 3,
          language: "en",
          maxCrawledPlaces: 3,
          includeReviews: false,
          includeImages: false,
          includePopularTimes: false,
          exportPlaceUrls: false,
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
      const result = await AnalysisService.pollApifyRunStatus(runId);
      
      if (result && result.items && result.items.length > 0) {
        return result.items.slice(0, 3).map((place: any) => ({
          name: place.name || "Unknown",
          rating: place.rating,
          reviewsCount: place.reviewsCount,
          address: place.address,
          category: place.category,
          website: place.website
        }));
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
