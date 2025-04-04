
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
  }
};
