
import React, { useState } from 'react';
import ResultsStep from './ResultsStep';
import LocationSelector from '@/components/LocationSelector';
import { AnalysisResult, BusinessCategory } from "@/services/AnalysisService";
import { PlaceSelectionResult } from '@/hooks/useGooglePlaces';
import { Step } from './ConversationPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface InputPanelProps {
  step: Step;
  businessName: string;
  analysisResult: AnalysisResult | null;
  suggestedCategories: BusinessCategory[];
  setBusinessName: (name: string) => void;
  handleBusinessNameSubmit: () => void;
  handleLocationSelect: (location: string, placeData?: PlaceSelectionResult) => void;
  handleStartOver: () => void;
}

const InputPanel: React.FC<InputPanelProps> = ({
  step,
  businessName,
  analysisResult,
  suggestedCategories,
  setBusinessName,
  handleBusinessNameSubmit,
  handleLocationSelect,
  handleStartOver
}) => {
  // Track which snippet is being shown during chatbot interaction
  const [visibleSnippet, setVisibleSnippet] = useState<'none' | 'competitors' | 'seo' | 'content'>('none');
  
  // Listen for message changes in ChatbotStep
  React.useEffect(() => {
    const handleChatbotMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'chatbot-selection') {
        if (event.data.message.includes('competitors')) {
          setVisibleSnippet('competitors');
        } else if (event.data.message.includes('SEO')) {
          setVisibleSnippet('seo');
        } else if (event.data.message.includes('Content')) {
          setVisibleSnippet('content');
        }
      }
    };
    
    window.addEventListener('message', handleChatbotMessage);
    return () => {
      window.removeEventListener('message', handleChatbotMessage);
    };
  }, []);

  // Monitor step changes and reset snippet visibility when appropriate
  React.useEffect(() => {
    if (step !== 'chatbot') {
      setVisibleSnippet('none');
    }
  }, [step]);

  return (
    <div className="w-full md:w-1/2">
      {/* Show location selector in the welcome step */}
      {step === 'welcome' && (
        <div className="bg-brand-gray-dark rounded-lg p-6 border border-gray-700 animate-fade-in">
          <LocationSelector onSelect={handleLocationSelect} />
        </div>
      )}
      
      {step === 'category-detection' && suggestedCategories.length > 0 && (
        <div className="bg-brand-gray-dark rounded-lg p-6 border border-gray-700 animate-fade-in">
          <h3 className="text-lg font-medium mb-4">Detected Categories:</h3>
          <ul className="space-y-2">
            {suggestedCategories.map((cat, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>{cat.name}</span>
                <span className="text-sm text-gray-400">
                  {Math.round(cat.confidence * 100)}% confidence
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {step === 'analyzing' && (
        <div className="bg-brand-gray-dark rounded-lg p-6 border border-gray-700 animate-fade-in">
          <h3 className="text-lg font-medium mb-4">AI Search Analysis</h3>
          <p className="text-sm text-gray-300">
            We will now run a research on Perplexity, Gemini, OpenAI, and Grok to see how visible
            you are in AI Search for the category of the business in your location.
          </p>
        </div>
      )}
      
      {/* Chatbot-triggered content snippets */}
      {step === 'chatbot' && (
        <div className="space-y-4 animate-fade-in">
          {visibleSnippet === 'competitors' && (
            <Card className="bg-gradient-to-br from-brand-gray-dark to-brand-blue-dark/30 border border-gray-700 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Top Competitors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Competitor A</span>
                    <span className="text-sm font-bold text-brand-blue-light">88% match</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Competitor B</span>
                    <span className="text-sm font-bold text-brand-blue-light">76% match</span>
                  </div>
                  <Progress value={76} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Competitor C</span>
                    <span className="text-sm font-bold text-brand-blue-light">62% match</span>
                  </div>
                  <Progress value={62} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )}
          
          {visibleSnippet === 'seo' && (
            <Card className="bg-gradient-to-br from-brand-gray-dark to-brand-blue-dark/30 border border-gray-700 text-white">
              <CardHeader>
                <CardTitle className="text-lg">SEO Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-green-500">+</span>
                    </div>
                    <p className="text-sm">Add more location-specific keywords to your website content</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-green-500">+</span>
                    </div>
                    <p className="text-sm">Create unique meta descriptions for each page</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-green-500">+</span>
                    </div>
                    <p className="text-sm">Focus on generating more customer reviews</p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}
          
          {visibleSnippet === 'content' && (
            <Card className="bg-gradient-to-br from-brand-gray-dark to-brand-blue-dark/30 border border-gray-700 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Content Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-brand-blue-dark/30 rounded-lg">
                    <h4 className="font-medium mb-1">Blog Topics</h4>
                    <ul className="text-sm text-gray-300">
                      <li>• Industry trends in {analysisResult?.category || "your industry"}</li>
                      <li>• Local customer success stories</li>
                      <li>• FAQ about your products/services</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-brand-blue-dark/30 rounded-lg">
                    <h4 className="font-medium mb-1">Content Types</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-brand-blue rounded-full"></div>
                        <span>How-to guides</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-brand-blue rounded-full"></div>
                        <span>Video tutorials</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-brand-blue rounded-full"></div>
                        <span>Case studies</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-brand-blue rounded-full"></div>
                        <span>Testimonials</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {visibleSnippet === 'none' && (
            <div className="bg-brand-gray-dark rounded-lg p-6 border border-gray-700 animate-fade-in flex items-center justify-center min-h-[200px]">
              <p className="text-gray-400 text-center">Select an option from the chatbot to see relevant insights</p>
            </div>
          )}
        </div>
      )}
      
      {step === 'results' && analysisResult && (
        <ResultsStep
          analysisResult={analysisResult}
          onStartOver={handleStartOver}
        />
      )}
    </div>
  );
};

export default InputPanel;
