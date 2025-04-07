
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApifyBusinessResult } from '@/services/types';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, Star, TrendingUp, BarChart2, Award, ThumbsUp, ThumbsDown } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface ReviewsPanelProps {
  apifyBusinessResult: ApifyBusinessResult | null | undefined;
  isVisible: boolean;
  businessName: string;
}

interface ReviewSentiment {
  positive: number;
  neutral: number;
  negative: number;
}

interface ReviewInfo {
  totalReviews: number;
  averageRating: number;
  sentiment: ReviewSentiment;
  topKeywords: string[];
}

const ReviewsPanel: React.FC<ReviewsPanelProps> = ({
  apifyBusinessResult,
  isVisible,
  businessName
}) => {
  const [reviewInfo, setReviewInfo] = useState<ReviewInfo | null>(null);
  const [animateProgress, setAnimateProgress] = useState(false);

  useEffect(() => {
    if (apifyBusinessResult && isVisible) {
      // Calculate review stats
      const reviews = apifyBusinessResult.reviews || [];
      
      if (reviews.length > 0) {
        // Calculate average rating
        const totalRating = reviews.reduce((sum, review) => {
          // Use stars if available, fall back to rating if stars is not available
          const reviewScore = review.stars || review.rating || 0;
          return sum + reviewScore;
        }, 0);
        
        const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;
        
        // Simulate sentiment analysis (in a real app, this would use NLP)
        // For this demo, we'll use the star rating as a proxy for sentiment
        let positive = 0;
        let neutral = 0;
        let negative = 0;
        
        reviews.forEach(review => {
          const reviewScore = review.stars || review.rating || 0;
          if (reviewScore >= 4) positive++;
          else if (reviewScore >= 3) neutral++;
          else negative++;
        });
        
        // Fake top keywords (in a real app, this would use keyword extraction)
        const topKeywords = ['friendly', 'service', 'quality', 'professional', 'helpful'];
        
        setReviewInfo({
          totalReviews: reviews.length,
          averageRating: avgRating,
          sentiment: {
            positive,
            neutral,
            negative
          },
          topKeywords
        });
        
        setTimeout(() => {
          setAnimateProgress(true);
        }, 500);
      }
    }
  }, [apifyBusinessResult, isVisible]);

  // If not visible, don't render
  if (!isVisible) return null;
  
  // Show loading state when data isn't available
  if (!apifyBusinessResult || !reviewInfo) {
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
              <MessageSquare size={18} className="text-uberall-rosa" />
              {businessName} Review Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative rounded-xl overflow-hidden border border-uberall-ultraviolet/20">
              <div className="absolute inset-0 bg-gradient-to-br from-uberall-ultraviolet/5 to-uberall-rosa/10 pointer-events-none" />
              
              <div className="space-y-4 p-6 flex flex-col items-center justify-center">
                <TrendingUp className="h-8 w-8 text-uberall-rosa animate-pulse" />
                <p className="text-uberall-spotlight-white text-sm">Analyzing review data...</p>
                
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

  // Calculate sentiment percentages
  const totalReviews = reviewInfo.sentiment.positive + reviewInfo.sentiment.neutral + reviewInfo.sentiment.negative;
  const positivePercent = totalReviews > 0 ? Math.round((reviewInfo.sentiment.positive / totalReviews) * 100) : 0;
  const neutralPercent = totalReviews > 0 ? Math.round((reviewInfo.sentiment.neutral / totalReviews) * 100) : 0;
  const negativePercent = totalReviews > 0 ? Math.round((reviewInfo.sentiment.negative / totalReviews) * 100) : 0;
  
  // Render stars based on average rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="w-5 h-5 text-gray-400" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="w-5 h-5 text-gray-400" />);
      }
    }
    
    return stars;
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
            <MessageSquare size={18} className="text-uberall-bright-blue" />
            {businessName} Review Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative rounded-xl overflow-hidden border border-uberall-ultraviolet/20">
            <div className="absolute inset-0 bg-gradient-to-br from-uberall-ultraviolet/5 to-uberall-rosa/10 pointer-events-none" />
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-uberall-ultraviolet/20 rounded-lg p-4">
                  <div className="text-sm text-gray-300 mb-1">Overall Rating</div>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-white mr-2">{reviewInfo.averageRating.toFixed(1)}</span>
                    <div className="flex">
                      {renderStars(reviewInfo.averageRating)}
                    </div>
                  </div>
                </div>
                <div className="bg-uberall-ultraviolet/20 rounded-lg p-4">
                  <div className="text-sm text-gray-300 mb-1">Total Reviews</div>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-white mr-2">{reviewInfo.totalReviews}</span>
                    <Award className="text-uberall-aqua" />
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                  <BarChart2 size={18} className="text-uberall-tangerine mr-2" />
                  Review Sentiment
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-300 flex items-center">
                        <ThumbsUp size={14} className="text-uberall-bold-green mr-1" />
                        Positive
                      </span>
                      <span className="text-sm text-uberall-bold-green font-medium">{positivePercent}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: animateProgress ? `${positivePercent}%` : '0%' }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                        className="h-full bg-gradient-to-r from-uberall-bold-green to-uberall-aqua"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-300">Neutral</span>
                      <span className="text-sm text-uberall-bright-blue font-medium">{neutralPercent}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: animateProgress ? `${neutralPercent}%` : '0%' }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-uberall-bright-blue to-uberall-aqua"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-300 flex items-center">
                        <ThumbsDown size={14} className="text-uberall-rosa mr-1" />
                        Negative
                      </span>
                      <span className="text-sm text-uberall-rosa font-medium">{negativePercent}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: animateProgress ? `${negativePercent}%` : '0%' }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.7 }}
                        className="h-full bg-gradient-to-r from-uberall-rosa to-uberall-ultraviolet"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Top Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {reviewInfo.topKeywords.map((keyword, index) => (
                    <motion.span
                      key={keyword}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + (index * 0.1) }}
                      className="px-3 py-1 bg-uberall-ultraviolet/30 text-white rounded-full text-sm"
                    >
                      {keyword}
                    </motion.span>
                  ))}
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="bg-uberall-ultraviolet/30 border border-uberall-ultraviolet/20 rounded-lg p-3 text-sm text-gray-200 mt-4"
              >
                <p>
                  <span className="font-semibold text-uberall-bright-blue">Pro Tip:</span> Positive reviews are critical for AI platforms when they recommend businesses to users. Encourage happy customers to leave reviews!
                </p>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReviewsPanel;
