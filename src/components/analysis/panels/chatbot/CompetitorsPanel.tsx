
import React from 'react';
import { ApifyCategoryResult } from "@/services/AnalysisService";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface CompetitorsPanelProps {
  apifyCategoryResults?: ApifyCategoryResult[];
}

const CompetitorsPanel: React.FC<CompetitorsPanelProps> = ({ apifyCategoryResults = [] }) => {
  return (
    <Card className="bg-gradient-to-br from-brand-gray-dark to-brand-blue-dark/30 border border-gray-700 text-white">
      <CardHeader>
        <CardTitle className="text-lg">Top Competitors</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {apifyCategoryResults && apifyCategoryResults.length > 0 ? (
          apifyCategoryResults.map((competitor, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <span>{competitor.name}</span>
                <span className="text-sm font-bold text-brand-blue-light">
                  {competitor.rating ? `${competitor.rating * 20}% match` : ''}
                </span>
              </div>
              <Progress value={competitor.rating ? competitor.rating * 20 : 0} className="h-2" />
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
