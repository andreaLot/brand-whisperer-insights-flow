
import React from 'react';
import { motion } from 'framer-motion';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MessageSquare, BarChart2, Shield, Sparkles, Star } from "lucide-react";

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
  
  // Get badge class based on rank
  const getRankBadgeClass = (rank: number) => {
    if (rank === 1) return "bg-amber-500/30 text-amber-200 ring-1 ring-amber-500/30";
    if (rank === 2) return "bg-slate-400/30 text-slate-200 ring-1 ring-slate-400/30";
    if (rank === 3) return "bg-amber-700/30 text-amber-300/80 ring-1 ring-amber-700/30";
    return "bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/20";
  };
  
  // Animation variants with staggered children for a cascade effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12, // Makes children appear one after another
        delayChildren: 0.3 // Initial delay before first child appears
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
        stiffness: 100,
        duration: 0.6
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: 0.1,
        duration: 0.5
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-violet-500/20 bg-violet-900/10 backdrop-blur-sm shadow-lg shadow-violet-900/10">
        <CardHeader className="pb-3">
          <motion.div variants={titleVariants} initial="hidden" animate="visible">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <BarChart2 size={18} className="text-violet-400" />
              AI Platform Ratings
            </CardTitle>
          </motion.div>
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
                  <motion.tr
                    key={index}
                    className="border-b border-gray-800 hover:bg-violet-950/10 transition-colors"
                    variants={itemVariants}
                  >
                    <TableCell className="font-mono text-sm text-gray-400">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <motion.div 
                        className="flex items-center gap-2"
                        initial={{ x: -5, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 + (index * 0.1), duration: 0.5 }}
                      >
                        <div className="p-1 rounded-full bg-gray-800/50 flex items-center justify-center">
                          {getPlatformIcon(result.platform || result.model)}
                        </div>
                        <span className="font-medium">{result.platform || result.model || `Platform ${index + 1}`}</span>
                      </motion.div>
                    </TableCell>
                    <TableCell className={`text-right font-mono ${getScoreColorClass(result.score)}`}>
                      <motion.div 
                        className="inline-flex items-center gap-1"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4 + (index * 0.1), duration: 0.5 }}
                      >
                        <span className="text-lg">{result.score}</span>
                        <span className="text-xs text-gray-400">/100</span>
                        
                        {result.score >= 90 && (
                          <motion.div
                            initial={{ rotate: -20, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ delay: 0.5 + (index * 0.1), type: "spring", stiffness: 400 }}
                          >
                            <Star size={14} className="text-amber-400 fill-amber-400 ml-1" />
                          </motion.div>
                        )}
                      </motion.div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {result.rank ? (
                        <motion.span 
                          className={`px-2.5 py-1 rounded-full text-xs ${getRankBadgeClass(result.rank)}`}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.5 + (index * 0.1), duration: 0.5 }}
                        >
                          #{result.rank}
                        </motion.span>
                      ) : '-'}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </motion.div>
          
          {/* Score legend */}
          <motion.div 
            className="mt-4 flex justify-center gap-4 text-xs text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.7 }}
          >
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span>Excellent (90+)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span>Good (80-89)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <span>Average (60-79)</span>
            </div>
          </motion.div>
        </CardContent>
      </Card>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.7 }}
        className="text-center text-sm text-gray-400"
      >
        Analysis for <span className="text-white font-medium">{businessName}</span> across major AI platforms. 
        <br />Higher scores indicate better visibility and representation in AI responses.
      </motion.div>
    </div>
  );
};

export default RatingsTable;
