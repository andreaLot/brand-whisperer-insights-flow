
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalysisResult } from '@/services/types';

interface SeoPanelProps {
  analysisResult: AnalysisResult;
}

const SeoPanel: React.FC<SeoPanelProps> = ({ analysisResult }) => {
  return (
    <Card className="bg-gradient-to-br from-uberall-dark-plum to-uberall-ultraviolet/30 border border-uberall-ultraviolet/30 text-white">
      <CardHeader>
        <CardTitle className="text-lg">SEO Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 bg-uberall-ultraviolet/30 rounded-lg">
            <h4 className="font-medium mb-1">Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {analysisResult.businessName && (
                <span className="px-2 py-1 bg-uberall-rosa/20 rounded-md text-sm">
                  {analysisResult.businessName}
                </span>
              )}
              {analysisResult.location && (
                <span className="px-2 py-1 bg-uberall-rosa/20 rounded-md text-sm">
                  {analysisResult.location}
                </span>
              )}
              {analysisResult.category && (
                <span className="px-2 py-1 bg-uberall-rosa/20 rounded-md text-sm">
                  {analysisResult.category}
                </span>
              )}
            </div>
          </div>
          
          <div className="p-3 bg-uberall-ultraviolet/30 rounded-lg">
            <h4 className="font-medium mb-1">Recommendations</h4>
            <ul className="text-sm text-gray-300">
              {analysisResult.recommendations && analysisResult.recommendations.length > 0 ? (
                analysisResult.recommendations.slice(0, 3).map((rec, index) => (
                  <li key={index}>• {rec}</li>
                ))
              ) : (
                <>
                  <li>• Optimize meta descriptions</li>
                  <li>• Create more internal links</li>
                  <li>• Improve mobile responsiveness</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeoPanel;
