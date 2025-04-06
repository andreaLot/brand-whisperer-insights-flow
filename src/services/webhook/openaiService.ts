
import { WebhookResponse, PlatformRanking } from '../types';
import { ApiRateLimiter } from './apiUtils';

// The API key would be better stored in environment variables or a secure storage
const OPENAI_API_KEY = "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";

/**
 * Calls the OpenAI API directly to analyze business data
 */
export const getOpenAIRanking = async (businessData: any): Promise<WebhookResponse | null> => {
  try {
    const businessName = (businessData.businessName || "Unknown Business") as string;
    const location = (businessData.location || "Unknown Location") as string;
    const category = (businessData.category || "Unknown Category") as string;

    console.log(`🔍 [OpenAIService] Processing request for ${businessName} in ${location}`);

    // Check cache first
    const cachedResult = ApiRateLimiter.getCachedResult(`openai-${businessName}`, location);
    if (cachedResult) {
      console.log(`📦 [OpenAIService] Using cached result for ${businessName}`);
      return cachedResult;
    }

    // Check rate limit
    if (!ApiRateLimiter.shouldAllowCall(`openai-${businessName}`, location)) {
      console.log(`⚠️ [OpenAIService] Rate limited for ${businessName}, using simulation`);
      return null;
    }

    console.log("🔍 [OpenAIService] Sending direct request to OpenAI API");

    // Create prompt for business analysis
    const prompt = `You are a search engine analyst who specializes in determining local business rankings.

I need you to analyze the local search ranking position for a business with these details:

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

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a search engine analyst who specializes in determining local business rankings. Your ONLY job is to provide the estimated ranking of a business in search results. Your response must be EXACTLY in this format: "Estimated Rank: X" where X is a number between 1 and 10. If you feel uncertain or unable to determine a specific rank for any reason, you MUST use rank 10.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 20
      }),
    });

    if (!response.ok) {
      console.error(`❌ [OpenAIService] API response error: ${response.status} ${response.statusText}`);
      throw new Error(`API response error: ${response.status}`);
    }

    const jsonResponse = await response.json();
    console.log("📥 [OpenAIService] Raw API response:", JSON.stringify(jsonResponse, null, 2));

    // Extract rank from OpenAI's response
    let estimatedRank: number | undefined;
    
    if (jsonResponse.choices && 
        jsonResponse.choices[0] && 
        jsonResponse.choices[0].message && 
        jsonResponse.choices[0].message.content) {
      
      const text = jsonResponse.choices[0].message.content;
      
      // Extract rank from content (e.g. "Estimated Rank: 3")
      const rankMatch = text.match(/Estimated Rank:\s*(\d+)/i);
      if (rankMatch && rankMatch[1]) {
        estimatedRank = parseInt(rankMatch[1], 10);
        console.log(`📊 [OpenAIService] Extracted rank: ${estimatedRank}`);
      }
    }

    if (!estimatedRank) {
      console.warn("⚠️ [OpenAIService] Could not extract rank from response");
      estimatedRank = 5; // Default rank
    }

    // Create platform ranking
    const platformRanking: PlatformRanking = {
      platform: "OpenAI",
      model: jsonResponse.model || "gpt-4o-mini",
      estimatedRank
    };

    // Return the response in the expected format
    const result = {
      platforms: [platformRanking],
      status: "success",
      message: "Direct OpenAI API analysis complete",
      timestamp: new Date().toISOString()
    };
    
    // Cache the result
    ApiRateLimiter.cacheResult(`openai-${businessName}`, location, result);
    
    return result;

  } catch (error) {
    console.error("❌ [OpenAIService] Error calling OpenAI API:", error);
    return null;
  }
};
