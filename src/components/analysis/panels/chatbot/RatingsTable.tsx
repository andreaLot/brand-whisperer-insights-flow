
import React from 'react';
import { motion } from 'framer-motion';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MessageSquare, BarChart2, Shield, Sparkles } from "lucide-react";

interface PlatformResult {
  platform?: string;
  model?: string;
  score: number;
  rank?: number;
}

interface RatingsTableProps {
  businessName: string;
  platformResults: PlatformResult[];
}

const RatingsTable: React.FC<RatingsTableProps> = ({ businessName, platformResults }) => {
  // If no results, show some demo data
  const results = platformResults.length > 0 ? platformResults : [
    { platform: 'Gemini', score: 87, rank: 3 },
    { platform: 'GPT-4o', score: 92, rank: 1 },
    { platform: 'Perplexity', score: 89, rank: 2 },
    { platform: 'DeepSeek', score: 83, rank: 4 },
    { platform: 'Mistral', score: 81, rank: 5 },
  ];

  // Get platform icon based on platform name
  const getPlatformIcon = (platform: string | undefined) => {
    const name = (platform || '').toLowerCase();
    
    if (name.includes('gemini')) return <Sparkles size={20} className="text-blue-400" />;
    if (name.includes('gpt') || name.includes('openai')) return <MessageSquare size={20} className="text-green-400" />;
    if (name.includes('perplexity')) return <Search size={20} className="text-purple-400" />;
    if (name.includes('deepseek')) return <Shield size={20} className="text-amber-400" />;
    if (name.includes('mistral')) return <BarChart2 size={20} className="text-red-400" />;
    
    return <Search size={20} className="text-gray-400" />;
  };
  
  // Get color class based on score
  const getScoreColorClass = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 80) return "text-green-400";
    if (score >= 70) return "text-lime-400";
    if (score >= 60) return "text-yellow-400";
    return "text-orange-500";
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-violet-500/20 bg-violet-900/10 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <BarChart2 size={18} className="text-violet-400" />
            AI Platform Ratings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="relative rounded-xl overflow-hidden border border-violet-500/20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/10 pointer-events-none" />
            
            <Table>
              <TableHeader className="bg-gray-900/50">
                <TableRow>
                  <TableHead className="w-[40px]">#</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Rank</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.sort((a, b) => (a.rank || 999) - (b.rank || 999)).map((result, index) => (
                  <TableRow key={index} className="border-b border-gray-800">
                    <motion.td
                      className="font-mono text-sm text-gray-400"
                      variants={itemVariants}
                    >
                      {index + 1}
                    </motion.td>
                    <motion.td variants={itemVariants}>
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(result.platform || result.model)}
                        <span>{result.platform || result.model || `Platform ${index + 1}`}</span>
                      </div>
                    </motion.td>
                    <motion.td className={`text-right ${getScoreColorClass(result.score)}`} variants={itemVariants}>
                      {result.score}/100
                    </motion.td>
                    <motion.td className="text-right font-medium" variants={itemVariants}>
                      {result.rank ? (
                        <span className="px-2 py-1 bg-violet-500/20 rounded text-violet-300 text-xs">
                          #{result.rank}
                        </span>
                      ) : '-'}
                    </motion.td>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </CardContent>
      </Card>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-center text-sm text-gray-400"
      >
        Analysis for {businessName} across major AI platforms. Higher scores indicate better visibility and representation.
      </motion.div>
    </div>
  );
};

export default RatingsTable;
