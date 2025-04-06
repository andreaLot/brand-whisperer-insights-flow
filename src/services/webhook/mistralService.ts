
import { WebhookResponse, PlatformRanking } from '../types';
import { ApiRateLimiter } from './apiUtils';

// The API key would be better stored in environment variables or a secure storage
const MISTRAL_API_KEY = "ODiNTvQVzkSyPasGMUk0VRLno2goYmXD";

/**
 * Calls the Mistral API directly to analyze business data
 */
export const getMistralRanking = async (businessData: any): Promise<WebhookResponse | null> => {
  try {
    const businessName = businessData.businessName || "Unknown Business";
    const location = businessData.location || "Unknown Location";
    const category = businessData.category || "Unknown Category";
    
    console.log(`🔍 [MistralService] Processing request for ${businessName} in ${location}`);
    
    // Check cache first
    const cachedResult = ApiRateLimiter.getCachedResult(`mistral-${businessName}`, location);
    if (cachedResult) {
      console.log(`📦 [MistralService] Using cached result for ${businessName}`);
      return cachedResult;
    }
    
    // Check rate limit
    if (!ApiRateLimiter.shouldAllowCall(`mistral-${businessName}`, location)) {
      console.log(`⚠️ [MistralService] Rate limited for ${businessName}, using simulation`);
      return null;
    }
    
    console.log("🔍 [MistralService] Sending direct request to Mistral API");
    
    // Create prompt for business analysis - same as Perplexity
    const systemPrompt = `You are a search engine analyst who specializes in determining local business rankings. Your ONLY job is to provide the estimated ranking of a business in search results. Your response must be EXACTLY in this format: 'Estimated Rank: X' where X is a number between 1 and 10. If you feel uncertain or unable to determine a specific rank for any reason, you MUST use rank 10.`;
    
    const userPrompt = `I need you to analyze the local search ranking position for a business with these details:

- Business Name: ${businessName}
- Location: ${location}
- Category/Industry: ${category}

Your task:
1. Simulate searching for "Best ${category} in ${location} within a 2km radius"
2. Based on the search simulation, determine the position where ${businessName} would likely appear in the results

Key ranking factors to consider:
- Query relevance
- Online reputation (ratings & review volume)
- Business prominence (citations, backlinks, mentions)
- Website content and structure (keywords, freshness, trust signals)
- Accuracy and completeness of listings
- User engagement and brand recognition

Ranking Rules:
1. If the business would appear in positions 1-9, provide that exact number (1-9)
2. If the business would appear at position 10 OR would not appear in the top 10 at all, provide the number 10
3. If you feel uncertain or unable to determine a specific rank for any reason, you MUST use rank 10

Your response must be EXACTLY in this format: 'Estimated Rank: X' where X is a number between 1 and 10. Do not include any other text, explanations, or formatting.`;

    // Call Mistral API
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MISTRAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral-medium',
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
      console.error(`❌ [MistralService] API response error: ${response.status} ${response.statusText}`);
      throw new Error(`API response error: ${response.status}`);
    }

    const jsonResponse = await response.json();
    console.log("📥 [MistralService] Raw API response:", JSON.stringify(jsonResponse, null, 2));

    // Extract rank from content
    let estimatedRank: number | undefined;
    const content = jsonResponse.choices?.[0]?.message?.content;
    
    if (content) {
      const rankMatch = content.match(/Estimated Rank:\s*(\d+)/i);
      if (rankMatch && rankMatch[1]) {
        estimatedRank = parseInt(rankMatch[1], 10);
        console.log(`📊 [MistralService] Extracted rank: ${estimatedRank}`);
      }
    }

    if (!estimatedRank) {
      console.warn("⚠️ [MistralService] Could not extract rank from response");
      estimatedRank = 5; // Default rank
    }

    // Create platform ranking
    const platformRanking: PlatformRanking = {
      platform: "Mistral",
      model: "mistral-medium",
      estimatedRank
    };

    // Return the response in the expected format
    const result = {
      platforms: [platformRanking],
      status: "success",
      message: "Direct Mistral API analysis complete",
      timestamp: new Date().toISOString()
    };
    
    // Cache the result
    ApiRateLimiter.cacheResult(`mistral-${businessName}`, location, result);
    
    return result;

  } catch (error) {
    console.error("❌ [MistralService] Error calling Mistral API:", error);
    return null;
  }
};
