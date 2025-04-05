
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContentPanelProps {
  category?: string;
}

const ContentPanel: React.FC<ContentPanelProps> = ({ category }) => {
  return (
    <Card className="bg-gradient-to-br from-brand-gray-dark to-brand-blue-dark/30 border border-gray-700 text-white">
      <CardHeader>
        <CardTitle className="text-lg">Content Strategy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 bg-brand-blue-dark/30 rounded-lg">
            <h4 className="font-medium mb-1">Blog Topics</h4>
            <ul className="text-sm text-gray-300">
              <li>• Industry trends in {category || "your industry"}</li>
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
  );
};

export default ContentPanel;
