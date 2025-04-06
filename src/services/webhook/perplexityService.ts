
import { WebhookResponse, PlatformRanking } from '../types';
import { ApiRateLimiter } from './apiUtils';

// Note: The API key would be better stored in environment variables or a secure storage
// For demonstration purposes, we're using it directly in the code
const PERPLEXITY_API_KEY = "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";

/**
 * Calls the Perplexity API directly to analyze business data
 */
export const getPerplexityRanking = async (businessData: any): Promise<WebhookResponse | null> => {
  try {
    const businessName = businessData.businessName || "Unknown Business";
    const location = businessData.location || "Unknown Location";
    const category = businessData.category || "Unknown Category";
    
    console.log(`🔍 [PerplexityService] Processing request for ${businessName} in ${location}`);
    
    // Check cache first
    const cachedResult = ApiRateLimiter.getCachedResult(businessName, location);
    if (cachedResult) {
      console.log(`📦 [PerplexityService] Using cached result for ${businessName}`);
      return cachedResult;
    }
    
    // Check rate limit
    if (!ApiRateLimiter.shouldAllowCall(businessName, location)) {
      console.log(`⚠️ [PerplexityService] Rate limited for ${businessName}, using simulation`);
      return null;
    }
    
    console.log("🔍 [PerplexityService] Sending direct request to Perplexity API");
    
    // Create prompt for business analysis
    const systemPrompt = `You are an expert in local business SEO and brand ranking analysis.`;
    
    const userPrompt = `Analyze the position of this business in search engines and AI platforms:
Business Name: ${businessName}
Location: ${location}
Category: ${category}

Provide the estimated search ranking position (a number between 1-20) for this business.
Only respond with the text "Estimated Rank: X" where X is your numerical estimate.`;

    // Call Perplexity API
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.2,
        max_tokens: 30
      }),
    });

    if (!response.ok) {
      console.error(`❌ [PerplexityService] API response error: ${response.status} ${response.statusText}`);
      throw new Error(`API response error: ${response.status}`);
    }

    const jsonResponse = await response.json();
    console.log("📥 [PerplexityService] Raw API response:", JSON.stringify(jsonResponse, null, 2));

    // Extract rank from content
    let estimatedRank: number | undefined;
    const content = jsonResponse.choices?.[0]?.message?.content;
    
    if (content) {
      const rankMatch = content.match(/Estimated Rank:\s*(\d+)/i);
      if (rankMatch && rankMatch[1]) {
        estimatedRank = parseInt(rankMatch[1], 10);
        console.log(`📊 [PerplexityService] Extracted rank: ${estimatedRank}`);
      }
    }

    if (!estimatedRank) {
      console.warn("⚠️ [PerplexityService] Could not extract rank from response");
      estimatedRank = 5; // Default rank
    }

    // Create platform ranking
    const platformRanking: PlatformRanking = {
      platform: "Perplexity",
      model: "llama-3.1-sonar-small-128k-online",
      estimatedRank
    };

    // Return the response in the expected format
    const result = {
      platforms: [platformRanking],
      status: "success",
      message: "Direct Perplexity API analysis complete",
      timestamp: new Date().toISOString()
    };
    
    // Cache the result
    ApiRateLimiter.cacheResult(businessName, location, result);
    
    return result;

  } catch (error) {
    console.error("❌ [PerplexityService] Error calling Perplexity API:", error);
    return null;
  }
};
