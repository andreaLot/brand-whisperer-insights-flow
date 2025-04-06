
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AnalysisResult, ApifyBusinessResult } from '@/services/types';

interface CompetitorsPanelProps {
  analysisResult: AnalysisResult;
  apifyBusinessResult?: ApifyBusinessResult | null;
}

const CompetitorsPanel: React.FC<CompetitorsPanelProps> = ({ 
  analysisResult, 
  apifyBusinessResult 
}) => {
  const competitors = apifyBusinessResult?.reviews || [];
  
  return (
    <Card className="bg-gradient-to-br from-brand-gray-dark to-brand-blue-dark/30 border border-gray-700 text-white">
      <CardHeader>
        <CardTitle className="text-lg">Top Competitors</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {competitors && competitors.length > 0 ? (
          competitors.slice(0, 3).map((competitor, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <span>{competitor.userName || `Competitor ${index + 1}`}</span>
                <span className="text-sm font-bold text-brand-blue-light">
                  {competitor.stars ? `${competitor.stars * 20}% match` : ''}
                </span>
              </div>
              <Progress value={competitor.stars ? competitor.stars * 20 : 0} className="h-2" />
            </div>
          ))
        ) : (
          <>
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
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CompetitorsPanel;
