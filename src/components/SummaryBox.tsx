
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Lightbulb, ChevronDown } from 'lucide-react';
import { motion } from "framer-motion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  
  const scoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500/20 to-green-500/5';
    if (score >= 60) return 'from-yellow-500/20 to-yellow-500/5';
    return 'from-red-500/20 to-red-500/5';
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Card className="bg-brand-gray-dark border border-gray-700 text-white shadow-lg">
      <CardContent className="pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-medium">Brand Analysis Summary</h3>
          <div className={`flex flex-col items-center gap-1`}>
            <div className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}
            </div>
            <div className="text-xs text-gray-400">Overall Score</div>
          </div>
        </div>

        <motion.div
          className="space-y-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <Collapsible defaultOpen className="border border-gray-700 rounded-lg overflow-hidden">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-green-500/10 to-transparent hover:from-green-500/20 transition-all">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-500/20 rounded-full">
                  <CheckCircle size={16} className="text-green-500" />
                </div>
                <span className="font-medium">Strengths</span>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <motion.ul className="p-4 pt-2 space-y-2" variants={container}>
                {strengths.map((strength, index) => (
                  <motion.li 
                    key={`strength-${index}`} 
                    className="text-sm text-gray-300 pl-8 relative"
                    variants={item}
                  >
                    <span className="absolute left-0 top-0 text-green-500">•</span>
                    {strength}
                  </motion.li>
                ))}
              </motion.ul>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible defaultOpen className="border border-gray-700 rounded-lg overflow-hidden">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-red-500/10 to-transparent hover:from-red-500/20 transition-all">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-red-500/20 rounded-full">
                  <AlertCircle size={16} className="text-red-500" />
                </div>
                <span className="font-medium">Areas for Improvement</span>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <motion.ul className="p-4 pt-2 space-y-2" variants={container}>
                {weaknesses.map((weakness, index) => (
                  <motion.li 
                    key={`weakness-${index}`} 
                    className="text-sm text-gray-300 pl-8 relative"
                    variants={item}
                  >
                    <span className="absolute left-0 top-0 text-red-500">•</span>
                    {weakness}
                  </motion.li>
                ))}
              </motion.ul>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible defaultOpen className="border border-gray-700 rounded-lg overflow-hidden">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-blue-500/10 to-transparent hover:from-blue-500/20 transition-all">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-brand-blue/20 rounded-full">
                  <Lightbulb size={16} className="text-brand-blue-light" />
                </div>
                <span className="font-medium">Recommendations</span>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <motion.ul className="p-4 pt-2 space-y-2" variants={container}>
                {recommendations.map((recommendation, index) => (
                  <motion.li 
                    key={`recommendation-${index}`} 
                    className="text-sm text-gray-300 pl-8 relative"
                    variants={item}
                  >
                    <span className="absolute left-0 top-0 text-brand-blue-light">•</span>
                    {recommendation}
                  </motion.li>
                ))}
              </motion.ul>
            </CollapsibleContent>
          </Collapsible>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default SummaryBox;
