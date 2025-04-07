
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, RefreshCw, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

interface RatingsTableEmptyStateProps {
  isLoading: boolean;
}

const RatingsTableEmptyState: React.FC<RatingsTableEmptyStateProps> = ({ isLoading }) => {
  const [progress, setProgress] = React.useState(0);
  
  React.useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 1;
          if (newProgress >= 100) {
            clearInterval(timer);
            return 100;
          }
          return newProgress;
        });
      }, 150);
      
      return () => clearInterval(timer);
    } else {
      setProgress(0);
    }
  }, [isLoading]);
  
  return (
    <div className="p-8 flex flex-col items-center justify-center text-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center py-4"
      >
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
          <Loader2 size={36} className="text-violet-400 animate-spin" />
          
          {/* Platform skeleton loading indicators */}
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-24 bg-violet-500/20" />
              <Skeleton className="h-6 w-14 bg-violet-500/20" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32 bg-violet-500/20" />
              <Skeleton className="h-6 w-14 bg-violet-500/20" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-28 bg-violet-500/20" />
              <Skeleton className="h-6 w-14 bg-violet-500/20" />
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full space-y-2">
            <Progress 
              value={progress} 
              className="h-2 w-full bg-violet-500/20" 
            />
            <p className="text-xs text-violet-300 text-right">{progress}%</p>
          </div>
        </div>
      </motion.div>
      <h3 className="text-lg font-medium text-violet-200 mt-4">Retrieving AI platform rankings...</h3>
      <p className="text-gray-400 text-sm mt-2">
        We're collecting and processing data from multiple AI platforms
      </p>
      <p className="text-violet-400/80 text-xs mt-4 italic">
        This may take a moment
      </p>
    </div>
  );
};

export default RatingsTableEmptyState;
