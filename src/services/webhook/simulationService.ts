import { WebhookResponse } from '../types';

/**
 * Simulates platform responses when the webhook fails or for testing
 */
export const simulatePlatformResponses = async (businessData: any): Promise<WebhookResponse> => {
  console.log("🔮 [SimulationService] Generating simulated platform responses");
  
  // Generate realistic platform rankings based on business name
  const businessNameHash = businessData.businessName
    ? Array.from(businessData.businessName).reduce((acc, char) => acc + char.charCodeAt(0), 0)
    : 0;
  
  // Add some randomness, but keep it consistent for the same business name
  const randomSeed = (businessNameHash % 100) / 100;
  
  // Generate a base rank that will be adjusted for each platform
  const baseRank = Math.max(1, Math.min(10, Math.ceil(randomSeed * 10)));
  
  // Function to create a rank with some variation around the base
  const varyRank = (adjustment: number) => {
    return Math.max(1, Math.min(20, baseRank + adjustment));
  };
  
  // Create platform responses
  const platforms = [
    {
      platform: "OpenAI",
      model: "gpt-4o",
      estimatedRank: varyRank(0) // Base rank
    },
    {
      platform: "Perplexity",
      model: "llama-3.1-sonar-small-128k-online",
      estimatedRank: varyRank(-1) // Slightly higher rank (lower number)
    },
    {
      platform: "Gemini",
      model: "gemini-2.0-flash",
      estimatedRank: varyRank(1) // Slightly lower rank (higher number)
    },
    {
      platform: "DeepSeek",
      model: "deepseek-chat",
      estimatedRank: varyRank(2) // Lower rank
    },
    {
      platform: "Mistral",
      model: "mistral-medium",
      estimatedRank: varyRank(-2) // Higher rank
    },
    {
      platform: "Anthropic",
      model: "claude-3-opus",
      estimatedRank: varyRank(3) // Even lower rank
    }
  ];

  // Get a random success message
  const messages = [
    "Generated simulated rankings for testing",
    "Virtual platform analysis complete",
    "Demo rankings created based on business profile",
    "Simulated AI platform rankings ready"
  ];
  
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  
  return {
    platforms,
    status: "success",
    message: randomMessage,
    timestamp: new Date().toISOString()
  };
};
