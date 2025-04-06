
import { WebhookResponse, PlatformRanking } from '../types';
import { ApiRateLimiter } from './apiUtils';

// The API key would be better stored in environment variables or a secure storage
const GEMINI_API_KEY = "AIzaSyDGdnWuMALNEg5MGjz7ZCBehqhBxaQwFa8";

/**
 * Calls the Gemini API directly to analyze business data
 */
export const getGeminiRanking = async (businessData: any): Promise<WebhookResponse | null> => {
  try {
    const businessName = businessData.businessName || "Unknown Business";
    const location = businessData.location || "Unknown Location";
    const category = businessData.category || "Unknown Category";
    
    console.log(`🔍 [GeminiService] Processing request for ${businessName} in ${location}`);
    
    // Check cache first
    const cachedResult = ApiRateLimiter.getCachedResult(`gemini-${businessName}`, location);
    if (cachedResult) {
      console.log(`📦 [GeminiService] Using cached result for ${businessName}`);
      return cachedResult;
    }
    
    // Check rate limit
    if (!ApiRateLimiter.shouldAllowCall(`gemini-${businessName}`, location)) {
      console.log(`⚠️ [GeminiService] Rate limited for ${businessName}, using simulation`);
      return null;
    }
    
    console.log("🔍 [GeminiService] Sending direct request to Gemini API");
    
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

    // Call Gemini API - Gemini has a different API structure than the others
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 30
        }
      }),
    });

    if (!response.ok) {
      console.error(`❌ [GeminiService] API response error: ${response.status} ${response.statusText}`);
      throw new Error(`API response error: ${response.status}`);
    }

    const jsonResponse = await response.json();
    console.log("📥 [GeminiService] Raw API response:", JSON.stringify(jsonResponse, null, 2));

    // Extract rank from content - Gemini response format is different
    let estimatedRank: number | undefined;
    
    if (jsonResponse.candidates && 
        jsonResponse.candidates[0] && 
        jsonResponse.candidates[0].content && 
        jsonResponse.candidates[0].content.parts && 
        jsonResponse.candidates[0].content.parts[0]) {
      
      const text = jsonResponse.candidates[0].content.parts[0].text;
      
      if (text) {
        const rankMatch = text.match(/Estimated Rank:\s*(\d+)/i);
        if (rankMatch && rankMatch[1]) {
          estimatedRank = parseInt(rankMatch[1], 10);
          console.log(`📊 [GeminiService] Extracted rank: ${estimatedRank}`);
        }
      }
    }

    if (!estimatedRank) {
      console.warn("⚠️ [GeminiService] Could not extract rank from response");
      estimatedRank = 5; // Default rank
    }

    // Create platform ranking
    const platformRanking: PlatformRanking = {
      platform: "Gemini",
      model: "gemini-2.0-flash",
      estimatedRank
    };

    // Return the response in the expected format
    const result = {
      platforms: [platformRanking],
      status: "success",
      message: "Direct Gemini API analysis complete",
      timestamp: new Date().toISOString()
    };
    
    // Cache the result
    ApiRateLimiter.cacheResult(`gemini-${businessName}`, location, result);
    
    return result;

  } catch (error) {
    console.error("❌ [GeminiService] Error calling Gemini API:", error);
    return null;
  }
};
