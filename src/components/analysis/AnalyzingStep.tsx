
import React from 'react';
import { Loader2 } from "lucide-react";

const AnalyzingStep: React.FC = () => {
  return (
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
  );
};

export default AnalyzingStep;
