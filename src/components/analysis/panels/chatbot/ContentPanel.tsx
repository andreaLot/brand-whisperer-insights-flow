
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalysisResult } from '@/services/types';

interface ContentPanelProps {
  analysisResult: AnalysisResult;
}

const ContentPanel: React.FC<ContentPanelProps> = ({ analysisResult }) => {
  return (
    <Card className="bg-gradient-to-br from-uberall-dark-plum to-uberall-ultraviolet/30 border border-uberall-ultraviolet/30 text-white">
      <CardHeader>
        <CardTitle className="text-lg">Content Strategy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 bg-uberall-ultraviolet/30 rounded-lg">
            <h4 className="font-medium mb-1">Blog Topics</h4>
            <ul className="text-sm text-gray-300">
              <li>• Industry trends in {analysisResult.category || "your industry"}</li>
              <li>• Local customer success stories in {analysisResult.location || "your area"}</li>
              <li>• FAQ about your products/services</li>
            </ul>
          </div>
          
          <div className="p-3 bg-uberall-ultraviolet/30 rounded-lg">
            <h4 className="font-medium mb-1">Content Types</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {analysisResult.strengths && analysisResult.strengths.length > 0 ? (
                analysisResult.strengths.slice(0, 4).map((strength, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-uberall-rosa rounded-full"></div>
                    <span>{strength}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-uberall-rosa rounded-full"></div>
                    <span>How-to guides</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-uberall-rosa rounded-full"></div>
                    <span>Video tutorials</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-uberall-bright-blue rounded-full"></div>
                    <span>Case studies</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-uberall-bright-blue rounded-full"></div>
                    <span>Testimonials</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentPanel;
