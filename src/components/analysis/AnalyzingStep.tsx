
import React from 'react';
import { Loader2 } from "lucide-react";

interface AnalyzingStepProps {
  primaryCategory?: string;
  location?: string;
}

const AnalyzingStep: React.FC<AnalyzingStepProps> = ({ primaryCategory, location }) => {
  const categoryText = primaryCategory || "your business category";
  const locationText = location ? ` in ${location}` : "";

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-normal">
        Analyzing your presence across <span className="text-brand-blue-light">multiple platforms</span>...
      </h2>
      <p className="text-sm mb-4">
        We will now run a research on Perplexity, Gemini, OpenAI, and Grok to see how visible
        you are in AI Search for {categoryText}{locationText}.
      </p>
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
  );
};

export default AnalyzingStep;
