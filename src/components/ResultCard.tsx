
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from "framer-motion";

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
  
  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500/20 to-transparent';
    if (score >= 60) return 'from-yellow-500/20 to-transparent';
    return 'from-red-500/20 to-transparent';
  };

  return (
    <Card className="bg-gradient-to-br from-brand-gray-dark to-brand-blue-dark/20 border border-gray-700 text-white shadow-lg hover:shadow-brand-blue/10 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && (
              <motion.div 
                className="p-1.5 bg-brand-gray-dark rounded-full"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 500, 
                  damping: 15 // Less damping for bouncier effect
                }}
              >
                {icon}
              </motion.div>
            )}
            <span className="text-white">{platform}</span>
          </div>
          {rank && (
            <motion.span 
              className="text-sm bg-gradient-to-r from-brand-blue to-brand-blue-light px-2.5 py-1 rounded-full font-medium"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ 
                delay: 0.2,
                type: "spring",
                stiffness: 300
              }}
            >
              Rank: #{rank}
            </motion.span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Sentiment Score</span>
            <motion.span 
              className={`font-semibold text-lg ${getScoreColor(score)}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: 0.3, 
                type: "spring",
                stiffness: 500
              }}
            >
              {score}
              <span className="text-xs text-gray-400">/{maxScore}</span>
            </motion.span>
          </div>
          
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ 
                  duration: 0.8, // Faster animation
                  ease: "easeOut", 
                  delay: 0.3 // Start sooner
                }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getProgressColor(score)}`}
              />
            </div>
          </div>
          
          <motion.div 
            className={`text-xs px-2.5 py-1.5 mt-2 rounded bg-gradient-to-r ${getScoreGradient(score)}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {score >= 80 ? "Excellent visibility" : 
             score >= 60 ? "Good visibility" : 
             "Needs improvement"}
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultCard;
