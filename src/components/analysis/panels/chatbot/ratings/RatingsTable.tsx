
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";
import PlatformTableRow from './PlatformTableRow';
import ScoreLegend from './ScoreLegend';
import TableFooter from './TableFooter';

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
  const [visibleRows, setVisibleRows] = useState<number[]>([]);
  const [cardVisible, setCardVisible] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [legendVisible, setLegendVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  // If no results, show some demo data, otherwise use the provided results
  const results = platformResults.length > 0 ? platformResults : [
    { platform: 'OpenAI', score: 92, rank: 1 },
    { platform: 'Perplexity', score: 89, rank: 2 },
    { platform: 'Gemini', score: 87, rank: 3 },
    { platform: 'DeepSeek', score: 83, rank: 4 },
    { platform: 'Mistral', score: 81, rank: 5 },
  ];

  // Log the results that will be displayed
  useEffect(() => {
    console.log("RatingsTable displaying platform results:", results);
  }, [results]);
  
  // Animate the table rows one by one with a staggered delay
  useEffect(() => {
    // First show the card container
    setTimeout(() => setCardVisible(true), 300);
    
    // Then show the title
    setTimeout(() => setTitleVisible(true), 800);
    
    // Then show each row one by one
    results.forEach((_, index) => {
      setTimeout(() => {
        setVisibleRows(prev => [...prev, index]);
      }, 1200 + (index * 600)); // 600ms delay between each row
    });
    
    // Finally show the legend and footer
    setTimeout(() => setLegendVisible(true), 1200 + (results.length * 600) + 300);
    setTimeout(() => setFooterVisible(true), 1200 + (results.length * 600) + 800);
  }, [results.length]);

  return (
    <AnimatePresence>
      {cardVisible && (
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <Card className="border-violet-500/20 bg-violet-900/10 backdrop-blur-sm shadow-lg shadow-violet-900/10">
            <CardHeader className="pb-3">
              <AnimatePresence>
                {titleVisible && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <CardTitle className="text-lg font-medium flex items-center gap-2 text-white">
                      <BarChart2 size={18} className="text-violet-400" />
                      AI Platform Ratings
                    </CardTitle>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardHeader>
            <CardContent>
              <div className="relative rounded-xl overflow-hidden border border-violet-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/10 pointer-events-none" />
                
                <Table>
                  <TableHeader className="bg-gray-900/50">
                    <TableRow>
                      <TableHead className="w-[40px] text-white">#</TableHead>
                      <TableHead className="text-white">Platform</TableHead>
                      <TableHead className="text-right text-white">Score</TableHead>
                      <TableHead className="text-right text-white">Rank</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results
                      .sort((a, b) => (a.rank || 999) - (b.rank || 999))
                      .map((result, index) => (
                        <PlatformTableRow 
                          key={index}
                          result={result}
                          index={index}
                          isVisible={visibleRows.includes(index)}
                        />
                      ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Score legend */}
              <AnimatePresence>
                {legendVisible && <ScoreLegend />}
              </AnimatePresence>
            </CardContent>
          </Card>
          
          <AnimatePresence>
            {footerVisible && <TableFooter businessName={businessName} />}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RatingsTable;
