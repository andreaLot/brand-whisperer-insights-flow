import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ConversationBubble from "@/components/ConversationBubble";
import SearchInput from "@/components/SearchInput";
import LocationSelector from "@/components/LocationSelector";
import ResultCard from "@/components/ResultCard";
import SummaryBox from "@/components/SummaryBox";
import { Loader2, Search, Map, BarChart2, MessageSquare } from "lucide-react";
import { AnalysisService, AnalysisResult, BusinessCategory } from "@/services/AnalysisService";

// Flow step type
type Step = 
  | 'welcome' 
  | 'business-name' 
  | 'location' 
  | 'category-detection' 
  | 'analyzing' 
  | 'results';

const Index = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('welcome');
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [suggestedCategories, setSuggestedCategories] = useState<BusinessCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Get current step number for progress indicator
  const getCurrentStepNumber = () => {
    const steps: Step[] = ['welcome', 'business-name', 'location', 'category-detection', 'analyzing', 'results'];
    return steps.indexOf(step);
  };

  // Handle business name submission
  const handleBusinessNameSubmit = async () => {
    if (!businessName.trim()) {
      toast({
        title: "Business name required",
        description: "Please enter your business name to continue",
        variant: "destructive",
      });
      return;
    }
    
    setStep('location');
  };

  // Handle location selection
  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
    setIsLoading(true);
    setStep('category-detection');
    
    // Detect business category
    detectCategory();
  };

  // Detect business category
  const detectCategory = async () => {
    try {
      const categories = await AnalysisService.detectCategory(businessName);
      setSuggestedCategories(categories);
      
      // Auto-select the highest confidence category
      if (categories.length > 0) {
        setCategory(categories[0].name);
      }
      
      // Move to analysis step after a short delay
      setTimeout(() => {
        setStep('analyzing');
        analyzeBrand();
      }, 2000);
      
    } catch (error) {
      console.error('Error detecting category:', error);
      toast({
        title: "Error",
        description: "Failed to detect business category. Please try again.",
        variant: "destructive",
      });
      setStep('business-name');
    }
  };

  // Analyze the brand
  const analyzeBrand = async () => {
    try {
      const result = await AnalysisService.analyzeBrand(businessName, location, category);
      setAnalysisResult(result);
      setIsLoading(false);
      setStep('results');
    } catch (error) {
      console.error('Error analyzing brand:', error);
      toast({
        title: "Error",
        description: "Failed to analyze your brand. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      setStep('business-name');
    }
  };

  // Start over from beginning
  const handleStartOver = () => {
    setStep('welcome');
    setBusinessName('');
    setLocation('');
    setCategory('');
    setSuggestedCategories([]);
    setAnalysisResult(null);
  };

  // Render platform icon based on name
  const renderPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'perplexity':
        return <Search size={16} className="text-purple-400" />;
      case 'gemini':
        return <MessageSquare size={16} className="text-blue-400" />;
      case 'grok':
        return <BarChart2 size={16} className="text-red-400" />;
      case 'searchgpt':
        return <Search size={16} className="text-green-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-black p-4 text-white">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8">
        {/* Left side - Conversation */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <ConversationBubble>
            {step === 'welcome' && (
              <div className="space-y-6">
                <h2 className="text-xl font-normal">
                  Let's get started! Simply enter your <span className="text-brand-blue-light">business name</span> and <span className="text-brand-blue-light">select a location</span> you'd like to analyze.
                </h2>
                <Button 
                  onClick={() => setStep('business-name')}
                  variant="elegant"
                  size="xl"
                  className="mt-4"
                >
                  Begin Analysis
                </Button>
              </div>
            )}
            
            {step === 'business-name' && (
              <div className="space-y-6">
                <h2 className="text-xl font-normal">
                  Enter your <span className="text-brand-blue-light">business name</span>
                </h2>
                <p className="text-gray-300 text-sm">
                  We'll use this to find information about your brand across multiple platforms.
                </p>
              </div>
            )}
            
            {step === 'location' && (
              <div className="space-y-6">
                <h2 className="text-xl font-normal">
                  Select a <span className="text-brand-blue-light">location</span> you'd like to analyze.
                </h2>
                <p className="text-gray-300 text-sm">
                  This helps us analyze your local presence and competition.
                </p>
              </div>
            )}
            
            {step === 'category-detection' && (
              <div className="space-y-6">
                <h2 className="text-xl font-normal">
                  Detecting your <span className="text-brand-blue-light">business category</span>...
                </h2>
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  <span className="text-sm">Analyzing your business name</span>
                </div>
              </div>
            )}
            
            {step === 'analyzing' && (
              <div className="space-y-6">
                <h2 className="text-xl font-normal">
                  Analyzing your presence across <span className="text-brand-blue-light">multiple platforms</span>...
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={16} />
                    <span className="text-sm">Checking Perplexity results</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={16} />
                    <span className="text-sm">Checking Gemini insights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={16} />
                    <span className="text-sm">Analyzing Grok data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={16} />
                    <span className="text-sm">Gathering SearchGPT results</span>
                  </div>
                </div>
              </div>
            )}
            
            {step === 'results' && analysisResult && (
              <div className="space-y-6">
                <h2 className="text-xl font-normal">
                  Analysis Complete for <span className="text-brand-blue-light">{analysisResult.businessName}</span>
                </h2>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-gray-400">Location:</span> {analysisResult.location}
                  </p>
                  <p>
                    <span className="text-gray-400">Category:</span> {analysisResult.category}
                  </p>
                  <p>
                    <span className="text-gray-400">Overall Score:</span> {analysisResult.overallScore}/100
                  </p>
                </div>
                <Button 
                  onClick={handleStartOver}
                  variant="elegant"
                  size="xl"
                  className="mt-4"
                >
                  Start New Analysis
                </Button>
              </div>
            )}
          </ConversationBubble>
        </div>
        
        {/* Right side - Input/Results */}
        <div className="w-full md:w-1/2">
          {(step === 'welcome' || step === 'business-name') && (
            <SearchInput
              placeholder="Search for your business"
              value={businessName}
              onChange={setBusinessName}
              onSubmit={handleBusinessNameSubmit}
            />
          )}
          
          {step === 'location' && (
            <LocationSelector onSelect={handleLocationSelect} />
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
          
          {step === 'results' && analysisResult && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {analysisResult.platformResults.map((result, index) => (
                  <ResultCard
                    key={index}
                    platform={result.platform}
                    score={result.score}
                    rank={result.rank}
                    icon={renderPlatformIcon(result.platform)}
                  />
                ))}
              </div>
              
              <SummaryBox
                overallScore={analysisResult.overallScore}
                strengths={analysisResult.strengths}
                weaknesses={analysisResult.weaknesses}
                recommendations={analysisResult.recommendations}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Embed info */}
      <div className="mt-12 text-center text-xs text-gray-500">
        <p>Brand Whisperer v1.0 - Embed this tool on your website with a simple iframe.</p>
      </div>
    </div>
  );
};

export default Index;
