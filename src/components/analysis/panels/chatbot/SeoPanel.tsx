
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SeoPanel: React.FC = () => {
  return (
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
  );
};

export default SeoPanel;
