
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, InfoIcon } from 'lucide-react';

interface SummaryBoxProps {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

const SummaryBox: React.FC<SummaryBoxProps> = ({
  overallScore,
  strengths,
  weaknesses,
  recommendations
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className="bg-brand-gray-dark border border-gray-700 text-white shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Brand Analysis Summary</span>
          <span className={`font-semibold text-xl ${getScoreColor(overallScore)}`}>
            {overallScore}/100
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium flex items-center">
            <CheckCircle size={18} className="text-green-500 mr-2" />
            Strengths
          </h3>
          <ul className="list-disc list-inside pl-5 text-sm text-gray-300">
            {strengths.map((strength, index) => (
              <li key={`strength-${index}`}>{strength}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium flex items-center">
            <AlertCircle size={18} className="text-red-500 mr-2" />
            Areas for Improvement
          </h3>
          <ul className="list-disc list-inside pl-5 text-sm text-gray-300">
            {weaknesses.map((weakness, index) => (
              <li key={`weakness-${index}`}>{weakness}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium flex items-center">
            <InfoIcon size={18} className="text-brand-blue mr-2" />
            Recommendations
          </h3>
          <ul className="list-disc list-inside pl-5 text-sm text-gray-300">
            {recommendations.map((recommendation, index) => (
              <li key={`recommendation-${index}`}>{recommendation}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryBox;
