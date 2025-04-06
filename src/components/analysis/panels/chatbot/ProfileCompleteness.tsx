
import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { ApifyBusinessResult } from '@/services/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Info, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileCompletenessProps {
  apifyBusinessResult: ApifyBusinessResult | null | undefined;
}

const ProfileCompleteness: React.FC<ProfileCompletenessProps> = ({ apifyBusinessResult }) => {
  const [completenessScore, setCompletenessScore] = useState(0);
  const [scoreDetails, setScoreDetails] = useState<Array<{field: string, present: boolean}>>([]);
  const [animateProgress, setAnimateProgress] = useState(false);
  
  useEffect(() => {
    if (apifyBusinessResult) {
      console.log("Calculating completeness from Apify data:", apifyBusinessResult);
      
      // Fields to check for completeness based on Apify data
      const fieldsToCheck = [
        { field: 'Name', present: !!apifyBusinessResult.name },
        { field: 'Address', present: !!apifyBusinessResult.address },
        { field: 'Category', present: !!apifyBusinessResult.category },
        { field: 'Website', present: !!apifyBusinessResult.website },
        { field: 'Phone Number', present: !!apifyBusinessResult.phoneNumber }, // Added phone number check
        { field: 'Reviews', present: !!apifyBusinessResult.reviews && apifyBusinessResult.reviews.length > 0 },
      ];
      
      // Calculate score (each field is worth ~16.67 points)
      const totalFields = fieldsToCheck.length;
      const presentFields = fieldsToCheck.filter(item => item.present).length;
      const calculatedScore = Math.round((presentFields / totalFields) * 100);
      
      setScoreDetails(fieldsToCheck);
      setCompletenessScore(0); // Start at 0
      
      // Set a short delay before animating the progress
      setTimeout(() => {
        setAnimateProgress(true);
        setCompletenessScore(calculatedScore);
      }, 500);
    }
  }, [apifyBusinessResult]);
  
  if (!apifyBusinessResult) {
    return null;
  }
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-gradient-to-r from-green-500 to-green-400';
    if (score >= 50) return 'bg-gradient-to-r from-yellow-500 to-yellow-400';
    return 'bg-gradient-to-r from-red-500 to-red-400';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.19, 1.0, 0.22, 1.0] }}
      className="mt-6"
    >
      <Card className="border-violet-500/20 bg-violet-900/10 backdrop-blur-sm shadow-lg shadow-violet-900/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2 text-white">
            <BarChart2 size={18} className="text-violet-400" />
            Google Business Profile Completeness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative rounded-xl overflow-hidden border border-violet-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/10 pointer-events-none" />
            
            <div className="space-y-4 p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Profile Score</h3>
                <motion.span 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: animateProgress ? 1 : 0.8 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
                  className={`text-2xl font-bold ${getScoreColor(completenessScore)}`}
                >
                  {completenessScore}%
                </motion.span>
              </div>
              
              <div className="relative h-2 overflow-hidden rounded-full bg-gray-700">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: `${completenessScore}%` }}
                  transition={{ 
                    duration: 1.5, 
                    ease: "easeOut",
                    delay: 0.5
                  }}
                  className={`absolute top-0 left-0 h-full ${getProgressColor(completenessScore)}`}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                {scoreDetails.map((detail, index) => (
                  <motion.div 
                    key={detail.field} 
                    className={`flex items-center p-2.5 rounded-lg ${detail.present ? 'bg-violet-800/30' : 'bg-gray-700/50'}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (index * 0.15) }}
                  >
                    {detail.present ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-400 mr-2.5" />
                    )}
                    <span className={detail.present ? 'text-white' : 'text-gray-400'}>
                      {detail.field}
                    </span>
                  </motion.div>
                ))}
              </div>
              
              {completenessScore < 70 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  className="bg-violet-800/30 border border-violet-500/20 rounded-lg p-3 text-sm text-gray-200"
                >
                  <p>
                    <span className="font-semibold text-violet-400">Pro Tip:</span> Complete your Google Business Profile to improve visibility in search results and AI platforms.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileCompleteness;
