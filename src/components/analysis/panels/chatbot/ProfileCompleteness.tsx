
import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { ApifyBusinessResult } from '@/services/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Info } from 'lucide-react';
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
      // Fields to check for completeness
      const fieldsToCheck = [
        { field: 'Name', present: !!apifyBusinessResult.name },
        { field: 'Address', present: !!apifyBusinessResult.address },
        { field: 'Category', present: !!apifyBusinessResult.category },
        { field: 'Website', present: !!apifyBusinessResult.website },
        // We don't have phone or claim status in our current data
        // So we'll set default values
        { field: 'Phone Number', present: false },
        { field: 'Claim Status', present: false },
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
      <Card className="border-brand-blue-light/20 bg-gradient-to-br from-gray-800/90 to-brand-blue-dark/50 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2 text-white">
            <Info size={18} className="text-brand-blue-light" />
            Google Business Profile Completeness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-200">Profile Score</h3>
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
                  className={`flex items-center p-2.5 rounded-lg ${detail.present ? 'bg-brand-blue-dark/40' : 'bg-gray-700/50'}`}
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
                className="bg-brand-blue-dark/50 border border-brand-blue-light/20 rounded-lg p-3 text-sm text-gray-200"
              >
                <p>
                  <span className="font-semibold text-brand-blue-light">Pro Tip:</span> Complete your Google Business Profile to improve visibility in search results and AI platforms.
                </p>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileCompleteness;
