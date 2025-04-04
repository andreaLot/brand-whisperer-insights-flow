
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ResultCardProps {
  platform: string;
  score: number;
  rank?: number;
  maxScore?: number;
  icon?: React.ReactNode;
}

const ResultCard: React.FC<ResultCardProps> = ({
  platform,
  score,
  rank,
  maxScore = 100,
  icon
}) => {
  const percentage = (score / maxScore) * 100;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="bg-gradient-to-br from-brand-gray-dark to-brand-blue-dark/30 border border-gray-700 text-white shadow-lg animate-fade-in hover:shadow-brand-blue/10 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && <span className="p-1.5 bg-brand-gray-dark rounded-full">{icon}</span>}
            <span>{platform}</span>
          </div>
          {rank && (
            <span className="text-sm bg-gradient-to-r from-brand-blue to-brand-blue-light px-2.5 py-1 rounded-full font-medium">
              Rank: #{rank}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span>Sentiment Score:</span>
          <span className={`font-semibold ${getScoreColor(score)}`}>
            {score}/{maxScore}
          </span>
        </div>
        <Progress
          value={percentage}
          className={`h-2 bg-gray-700`}
          // Fix: Use the correct class on the Progress component directly
          // instead of trying to use an indicatorClassName prop
          style={{ 
            ['--progress-background' as any]: getProgressColor(score) 
          }}
        />
      </CardContent>
    </Card>
  );
};

export default ResultCard;
