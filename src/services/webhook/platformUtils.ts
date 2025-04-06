// Helper map of model identifiers to platform names for better display
export const modelToPlatformMap: Record<string, string> = {
  // OpenAI models
  "gpt-4o": "OpenAI",
  "gpt-4": "OpenAI",
  "gpt-3.5": "OpenAI",
  "gpt": "OpenAI",
  "openai": "OpenAI",
  
  // Perplexity models
  "llama-3.1": "Perplexity", 
  "llama-3": "Perplexity",
  "perplexity": "Perplexity",
  
  // Mistral models
  "mistral-large": "Mistral",
  "mistral-medium": "Mistral",
  "mistral": "Mistral",
  
  // DeepSeek models
  "deepseek-chat": "DeepSeek",
  "deepseek": "DeepSeek",
  
  // Gemini models
  "gemini": "Gemini",
  "bard": "Gemini",
  "palm": "Gemini",
  
  // Others
  "claude": "Anthropic",
};

// Function to normalize model names to platform names
export const normalizeModelToPlatform = (model?: string): string => {
  if (!model) return "AI Analysis";
  
  const modelLower = model.toLowerCase();
  
  // Check if any key in the map is contained in the model string
  for (const [key, platform] of Object.entries(modelToPlatformMap)) {
    if (modelLower.includes(key)) {
      return platform;
    }
  }
  
  return model; // Return the original model if no match
};
