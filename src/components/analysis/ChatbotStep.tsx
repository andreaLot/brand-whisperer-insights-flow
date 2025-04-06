
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import CompletionButton from './components/CompletionButton';
import { ApifyService } from '@/services/AnalysisService';

interface ChatbotStepProps {
  primaryCategory?: string;
  location?: string;
  businessName: string;
  onChatComplete: () => void;
}

const ChatbotStep: React.FC<ChatbotStepProps> = ({
  primaryCategory,
  location,
  businessName,
  onChatComplete
}) => {
  const [chatMessages, setChatMessages] = useState<string[]>([
    "Let me help you learn more about your ranking analysis. What would you like to know?"
  ]);
  
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);
  const [isFetchingCompetitors, setIsFetchingCompetitors] = useState(false);
  
  useEffect(() => {
    // Check if we already have category results cached from the business search
    const hasCompetitorData = (window as any).apifyCategoryResults && 
                            (window as any).apifyCategoryResults.length > 0;
                            
    console.log("Checking for cached competitor data:", hasCompetitorData);
    
    // If competitors were already fetched during the business search, no need to fetch again
    if (!hasCompetitorData && primaryCategory && location) {
      setIsFetchingCompetitors(true);
      
      ApifyService.fetchCategoryFromApify(primaryCategory, location)
        .then((results) => {
          if (results.length > 0) {
            console.log("Fetched competitor data for chatbot:", results);
            // Cache the results if not already cached
            if (!(window as any).apifyCategoryResults) {
              (window as any).apifyCategoryResults = results;
            }
          }
        })
        .catch((error) => console.error("Error fetching competitors:", error))
        .finally(() => setIsFetchingCompetitors(false));
    }
  }, [primaryCategory, location]);
  
  const handleChatOptionClick = (option: string) => {
    // Add the selected option to chat
    setChatMessages(prev => [...prev, `You: ${option}`]);
    setIsLoadingMessage(true);
    
    // Simulate response after a delay
    setTimeout(() => {
      let response = "";
      
      if (option.includes('competitors')) {
        response = `Here's a comparison with your top competitors in ${location || 'your area'}.`;
        // Notify parent components to show the competitors panel
        window.postMessage({ type: 'chatbot-selection', message: 'competitors' }, '*');
      } else if (option.includes('SEO')) {
        response = `Here are some SEO tips for ${businessName} as a ${primaryCategory || 'business'}.`;
        window.postMessage({ type: 'chatbot-selection', message: 'SEO' }, '*');
      } else if (option.includes('Content')) {
        response = `Here are content strategy recommendations for a ${primaryCategory || 'business'} in ${location || 'your area'}.`;
        window.postMessage({ type: 'chatbot-selection', message: 'Content' }, '*');
      }
      
      setChatMessages(prev => [...prev, response]);
      setIsLoadingMessage(false);
    }, 1000);
  };
  
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
      <h2 className="text-2xl font-bold">AI Recommendations</h2>
      
      <div className="space-y-4">
        {chatMessages.map((message, i) => (
          <div 
            key={i} 
            className={`${
              message.startsWith("You:") 
                ? "bg-gray-700 ml-auto" 
                : "bg-brand-primary"
            } p-3 rounded-lg max-w-[80%] ${
              message.startsWith("You:") ? "ml-auto" : ""
            }`}
          >
            {message}
          </div>
        ))}
        
        {isLoadingMessage && (
          <div className="bg-brand-primary p-3 rounded-lg max-w-[80%] flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing...</span>
          </div>
        )}
        
        {isFetchingCompetitors && (
          <div className="bg-brand-primary p-3 rounded-lg max-w-[80%] flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Finding competitors...</span>
          </div>
        )}
      </div>
      
      {!isLoadingMessage && (
        <div className="space-y-2">
          <button
            onClick={() => handleChatOptionClick("How do I compare to my competitors?")}
            className="bg-gray-800 hover:bg-gray-700 w-full p-2 rounded text-left"
          >
            How do I compare to my competitors?
          </button>
          <button
            onClick={() => handleChatOptionClick("What SEO improvements can I make?")}
            className="bg-gray-800 hover:bg-gray-700 w-full p-2 rounded text-left"
          >
            What SEO improvements can I make?
          </button>
          <button
            onClick={() => handleChatOptionClick("What Content should I create?")}
            className="bg-gray-800 hover:bg-gray-700 w-full p-2 rounded text-left"
          >
            What Content should I create?
          </button>
        </div>
      )}
      
      <CompletionButton 
        onClick={onChatComplete}
        text="View Full Analysis"
      />
    </div>
  );
};

export default ChatbotStep;
