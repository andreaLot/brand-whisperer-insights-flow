
import { WebhookResponse, PlatformRanking } from '../types';
import { ApiRateLimiter } from './apiUtils';

// The API key would be better stored in environment variables or a secure storage
const DEEPSEEK_API_KEY = "sk-67690f9155a2443d89e64d83ca30c73d";

/**
 * Calls the DeepSeek API directly to analyze business data
 */
export const getDeepSeekRanking = async (businessData: any): Promise<WebhookResponse | null> => {
  try {
    const businessName = businessData.businessName || "Unknown Business";
    const location = businessData.location || "Unknown Location";
    const category = businessData.category || "Unknown Category";
    
    console.log(`🔍 [DeepSeekService] Processing request for ${businessName} in ${location}`);
    
    // Check cache first
    const cachedResult = ApiRateLimiter.getCachedResult(`deepseek-${businessName}`, location);
    if (cachedResult) {
      console.log(`📦 [DeepSeekService] Using cached result for ${businessName}`);
      return cachedResult;
    }
    
    // Check rate limit
    if (!ApiRateLimiter.shouldAllowCall(`deepseek-${businessName}`, location)) {
      console.log(`⚠️ [DeepSeekService] Rate limited for ${businessName}, using simulation`);
      return null;
    }
    
    console.log("🔍 [DeepSeekService] Sending direct request to DeepSeek API");
    
    // Create prompt for business analysis
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

    // Call DeepSeek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
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
      console.error(`❌ [DeepSeekService] API response error: ${response.status} ${response.statusText}`);
      throw new Error(`API response error: ${response.status}`);
    }

    const jsonResponse = await response.json();
    console.log("📥 [DeepSeekService] Raw API response:", JSON.stringify(jsonResponse, null, 2));

    // Extract rank from content
    let estimatedRank: number | undefined;
    const content = jsonResponse.choices?.[0]?.message?.content;
    
    if (content) {
      const rankMatch = content.match(/Estimated Rank:\s*(\d+)/i);
      if (rankMatch && rankMatch[1]) {
        estimatedRank = parseInt(rankMatch[1], 10);
        console.log(`📊 [DeepSeekService] Extracted rank: ${estimatedRank}`);
      }
    }

    if (!estimatedRank) {
      console.warn("⚠️ [DeepSeekService] Could not extract rank from response");
      estimatedRank = 5; // Default rank
    }

    // Create platform ranking
    const platformRanking: PlatformRanking = {
      platform: "DeepSeek",
      model: "deepseek-chat",
      estimatedRank
    };

    // Return the response in the expected format
    const result = {
      platforms: [platformRanking],
      status: "success",
      message: "Direct DeepSeek API analysis complete",
      timestamp: new Date().toISOString()
    };
    
    // Cache the result
    ApiRateLimiter.cacheResult(`deepseek-${businessName}`, location, result);
    
    return result;

  } catch (error) {
    console.error("❌ [DeepSeekService] Error calling DeepSeek API:", error);
    return null;
  }
};
