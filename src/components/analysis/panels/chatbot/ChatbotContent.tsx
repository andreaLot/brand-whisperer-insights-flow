
import React from 'react';
import CompetitorsPanel from './CompetitorsPanel';
import SeoPanel from './SeoPanel';
import ContentPanel from './ContentPanel';
import { ApifyCategoryResult, ApifyBusinessResult } from "@/services/AnalysisService";

interface ChatbotContentProps {
  visibleSnippet: 'none' | 'competitors' | 'seo' | 'content';
  apifyCategoryResults?: ApifyCategoryResult[];
  analysisResult?: any;
  apifyBusinessResult?: ApifyBusinessResult | null;
}

const ChatbotContent: React.FC<ChatbotContentProps> = ({ 
  visibleSnippet, 
  apifyCategoryResults = [], 
  analysisResult,
  apifyBusinessResult
}) => {
  if (visibleSnippet === 'competitors') {
    return <CompetitorsPanel apifyCategoryResults={apifyCategoryResults} />;
  }

  if (visibleSnippet === 'seo') {
    return <SeoPanel />;
  }

  if (visibleSnippet === 'content') {
    return <ContentPanel category={analysisResult?.category || apifyBusinessResult?.category} />;
  }

  return (
    <div className="bg-brand-gray-dark rounded-lg p-6 border border-gray-700 animate-fade-in flex items-center justify-center min-h-[200px]">
      <p className="text-gray-400 text-center">Select an option from the chatbot to see relevant insights</p>
    </div>
  );
};

export default ChatbotContent;
