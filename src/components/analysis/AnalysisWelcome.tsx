
import React from 'react';
import { Button } from "@/components/ui/button";

interface AnalysisWelcomeProps {
  onBeginAnalysis: () => void;
}

const AnalysisWelcome: React.FC<AnalysisWelcomeProps> = ({ onBeginAnalysis }) => {
  return (
    <div className="h-full flex flex-col justify-between">
      <h2 className="text-xl font-normal font-tiempos">
        Let's get started!
        <br />
        <br />
        Simply enter your <span className="text-brand-blue-light font-bold text-violet-500">business name</span> and <span className="text-brand-blue-light">select a location</span> you'd like to analyze<span className="typewriter-cursor"></span>
      </h2>
      <div className="mt-auto">
        <Button onClick={onBeginAnalysis} variant="dynamic" size="xl" className="w-full md:w-auto">
          Begin Analysis
        </Button>
      </div>
    </div>
  );
};

export default AnalysisWelcome;
