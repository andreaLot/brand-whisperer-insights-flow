
import React from 'react';
import SeoPanel from './SeoPanel';
import ContentPanel from './ContentPanel';
import { ApifyBusinessResult } from "@/services/AnalysisService";

interface ChatbotContentProps {
  visibleSnippet: 'none' | 'competitors' | 'seo' | 'content';
  analysisResult?: any;
  apifyBusinessResult?: ApifyBusinessResult | null;
}

const ChatbotContent: React.FC<ChatbotContentProps> = ({ 
  visibleSnippet, 
  analysisResult,
  apifyBusinessResult
}) => {
  // For competitors snippet, we'll show a message to focus on business details first
  if (visibleSnippet === 'competitors') {
    return (
      <div className="bg-brand-gray-dark rounded-lg p-6 border border-gray-700 animate-fade-in">
        <h3 className="text-lg font-medium mb-4">Business Details</h3>
        {apifyBusinessResult ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Business Name:</span>
              <span className="text-brand-blue-light">{apifyBusinessResult.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Category:</span>
              <span>{apifyBusinessResult.category || 'Not available'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Rating:</span>
              <span>{apifyBusinessResult.rating || 'Not available'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Reviews:</span>
              <span>{apifyBusinessResult.reviewsCount || '0'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Address:</span>
              <span className="text-sm text-right">{apifyBusinessResult.address || 'Not available'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Website:</span>
              <span className="text-brand-blue-light text-sm">
                {apifyBusinessResult.website ? (
                  <a href={apifyBusinessResult.website} target="_blank" rel="noopener noreferrer">
                    {apifyBusinessResult.website}
                  </a>
                ) : 'Not available'}
              </span>
            </div>
          </div>
        ) : (
          <p>Loading business details...</p>
        )}
      </div>
    );
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
