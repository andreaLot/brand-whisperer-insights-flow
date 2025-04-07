import React, { useEffect, useState } from 'react';
import { ApifyBusinessResult } from '@/services/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, BarChart2, Loader2, Shield, MapPin, Phone, Globe, Newspaper, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileCompletenessProps {
  apifyBusinessResult: ApifyBusinessResult | null | undefined;
  isVisible: boolean;
}

const ProfileCompleteness: React.FC<ProfileCompletenessProps> = ({ 
  apifyBusinessResult, 
  isVisible 
}) => {
  const [completenessScore, setCompletenessScore] = useState(0);
  const [scoreDetails, setScoreDetails] = useState<Array<{field: string, present: boolean, icon: React.ReactNode}>>([]);
  const [animateProgress, setAnimateProgress] = useState(false);
  
  useEffect(() => {
    if (apifyBusinessResult && isVisible) {
      console.log("ProfileCompleteness: Calculating completeness from Apify data:", apifyBusinessResult);
      
      const fieldsToCheck = [
        { field: 'Name', present: !!apifyBusinessResult.name, icon: <Shield size={18} className="mr-2" /> },
        { field: 'Address', present: !!apifyBusinessResult.address, icon: <MapPin size={18} className="mr-2" /> },
        { field: 'Category', present: !!apifyBusinessResult.category, icon: <Shield size={18} className="mr-2" /> },
        { field: 'Website', present: !!apifyBusinessResult.website, icon: <Globe size={18} className="mr-2" /> },
        { field: 'Phone Number', present: !!apifyBusinessResult.phoneNumber, icon: <Phone size={18} className="mr-2" /> },
        { field: 'Reviews', present: !!apifyBusinessResult.reviews && apifyBusinessResult.reviews.length > 0, icon: <MessageSquare size={18} className="mr-2" /> },
        { field: 'Photos', present: !!(apifyBusinessResult.photos || apifyBusinessResult.images) && ((apifyBusinessResult.photos?.length || 0) > 0 || (apifyBusinessResult.images?.length || 0) > 0), icon: <Newspaper size={18} className="mr-2" /> },
      ];
      
      const totalFields = fieldsToCheck.length;
      const presentFields = fieldsToCheck.filter(item => item.present).length;
      const calculatedScore = Math.round((presentFields / totalFields) * 100);
      
      setScoreDetails(fieldsToCheck);
      setCompletenessScore(0);
      
      setTimeout(() => {
        setAnimateProgress(true);
        setCompletenessScore(calculatedScore);
      }, 500);
    }
  }, [apifyBusinessResult, isVisible]);
  
  if (!isVisible) {
    return null;
  }
  
  if (!apifyBusinessResult) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.19, 1.0, 0.22, 1.0] }}
        className="mt-6"
      >
        <Card className="border-uberall-ultraviolet/20 bg-uberall-ultraviolet/10 backdrop-blur-sm shadow-lg shadow-uberall-ultraviolet/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2 text-white">
              <BarChart2 size={18} className="text-uberall-rosa" />
              Google Business Profile Completeness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative rounded-xl overflow-hidden border border-uberall-ultraviolet/20">
              <div className="absolute inset-0 bg-gradient-to-br from-uberall-ultraviolet/5 to-uberall-rosa/10 pointer-events-none" />
              
              <div className="space-y-4 p-6 flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 text-uberall-rosa animate-spin" />
                <p className="text-uberall-spotlight-white text-sm">Loading profile data...</p>
                
                <div className="w-full space-y-3">
                  <Skeleton className="h-8 w-full bg-uberall-ultraviolet/30" />
                  <Skeleton className="h-2 w-full bg-uberall-ultraviolet/30" />
                  
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {[1, 2, 3, 4].map(i => (
                      <Skeleton key={i} className="h-12 w-full bg-uberall-ultraviolet/20" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-uberall-bold-green';
    if (score >= 50) return 'text-uberall-tangerine';
    return 'text-uberall-rosa';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-gradient-to-r from-uberall-bold-green to-uberall-aqua';
    if (score >= 50) return 'bg-gradient-to-r from-uberall-tangerine to-uberall-bright-blue';
    return 'bg-gradient-to-r from-uberall-rosa to-uberall-ultraviolet';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.19, 1.0, 0.22, 1.0] }}
      className="mt-6"
    >
      <Card className="border-uberall-ultraviolet/20 bg-uberall-ultraviolet/10 backdrop-blur-sm shadow-lg shadow-uberall-ultraviolet/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2 text-white">
            <BarChart2 size={18} className="text-uberall-rosa" />
            Google Business Profile Completeness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative rounded-xl overflow-hidden border border-uberall-ultraviolet/20">
            <div className="absolute inset-0 bg-gradient-to-br from-uberall-ultraviolet/5 to-uberall-rosa/10 pointer-events-none" />
            
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
                    className={`flex items-center p-2.5 rounded-lg ${detail.present ? 'bg-uberall-ultraviolet/30' : 'bg-gray-700/50'}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (index * 0.15) }}
                  >
                    {detail.present ? (
                      <CheckCircle className="h-5 w-5 text-uberall-bold-green mr-2.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-400 mr-2.5" />
                    )}
                    <span className={`flex items-center ${detail.present ? 'text-white' : 'text-gray-400'}`}>
                      {detail.icon}
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
                  className="bg-uberall-ultraviolet/30 border border-uberall-ultraviolet/20 rounded-lg p-3 text-sm text-gray-200"
                >
                  <p>
                    <span className="font-semibold text-uberall-rosa">Pro Tip:</span> Complete your Google Business Profile to improve visibility in search results and AI platforms.
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
