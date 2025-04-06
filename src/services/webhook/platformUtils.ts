
// Helper map of model identifiers to platform names for better display
export const modelToPlatformMap: Record<string, string> = {
  // OpenAI models
  "gpt-4o": "OpenAI",
  "gpt-4o-mini": "OpenAI",
  "gpt-4": "OpenAI",
  "gpt-3.5": "OpenAI",
  "gpt": "OpenAI",
  "openai": "OpenAI",
  
  // Perplexity models
  "llama-3.1-sonar-small-128k-online": "Perplexity",
  "llama-3.1-sonar-large-128k-online": "Perplexity",
  "llama-3.1-sonar-huge-128k-online": "Perplexity",
  "llama-3.1-sonar": "Perplexity",
  "llama-3.1": "Perplexity", 
  "llama-3": "Perplexity",
  "perplexity": "Perplexity",
  
  // Mistral models
  "mistral-large": "Mistral",
  "mistral-medium": "Mistral",
  "mistral-small": "Mistral",
  "mistral": "Mistral",
  
  // DeepSeek models
  "deepseek-chat": "DeepSeek",
  "deepseek-coder": "DeepSeek",
  "deepseek": "DeepSeek",
  
  // Gemini models
  "gemini-2.0-flash": "Gemini",
  "gemini-1.5-flash": "Gemini",
  "gemini-1.5-pro": "Gemini",
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
  
  // Direct match for complete model name
  if (modelToPlatformMap[model]) {
    return modelToPlatformMap[model];
  }
  
  // Check if any key in the map is contained in the model string
  for (const [key, platform] of Object.entries(modelToPlatformMap)) {
    if (modelLower.includes(key.toLowerCase())) {
      return platform;
    }
  }
  
  return model; // Return the original model if no match
};
