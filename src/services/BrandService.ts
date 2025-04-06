
import { AnalysisResult } from './types';

export const BrandService = {
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
    const mistralScore = Math.min(100, Math.max(40, baseScore + 10 + Math.floor(Math.random() * 10) - 10));
    const deepseekScore = Math.min(100, Math.max(40, baseScore - 10 + Math.floor(Math.random() * 15)));
    
    const overallScore = Math.floor((perplexityScore + geminiScore + mistralScore + deepseekScore) / 4);
    
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
    
    if (mistralScore > 70) {
      strengths.push('Positive sentiment in social media discussions.');
    } else {
      weaknesses.push('Mixed sentiment detected in online conversations.');
      recommendations.push('Engage more with your audience on social platforms to improve sentiment.');
    }
    
    if (deepseekScore > 70) {
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
          platform: 'Mistral',
          score: mistralScore,
          rank: Math.floor(Math.random() * 10) + 1
        },
        {
          platform: 'Deepseek',
          score: deepseekScore,
          rank: Math.floor(Math.random() * 10) + 1
        }
      ],
      strengths,
      weaknesses,
      recommendations
    };
  }
};
