
import { useState, useEffect } from 'react';

interface PlatformResult {
  platform?: string;
  model?: string;
  score: number;
  rank?: number;
}

interface UseRatingsAnimationProps {
  results: PlatformResult[];
  hasResults: boolean;
}

interface RatingsAnimationState {
  visibleRows: number[];
  cardVisible: boolean;
  titleVisible: boolean;
  legendVisible: boolean;
  footerVisible: boolean;
  hasInitialized: boolean;
  isLoading: boolean;
}

const useRatingsAnimation = ({ results, hasResults }: UseRatingsAnimationProps) => {
  const [animationState, setAnimationState] = useState<RatingsAnimationState>({
    visibleRows: [],
    cardVisible: false,
    titleVisible: false,
    legendVisible: false,
    footerVisible: false,
    hasInitialized: false,
    isLoading: true
  });
  
  // Handle initial animation sequence
  useEffect(() => {
    if (animationState.hasInitialized) return; // Prevent multiple initializations
    
    console.log("🎯 [RatingsAnimation] Received platformResults:", JSON.stringify(results, null, 2));
    console.log(`🎯 [RatingsAnimation] Number of platform results: ${results.length}`);
    
    // Only animate if we have actual results
    if (hasResults) {
      // Set has initialized to prevent multiple animations
      setAnimationState(prev => ({ ...prev, hasInitialized: true }));
      
      // First show the card and loading state
      setAnimationState(prev => ({ ...prev, cardVisible: true }));
      
      // Start complete animation sequence after a delay to simulate loading
      setTimeout(() => {
        setAnimationState(prev => ({ ...prev, isLoading: false }));
        startAnimations(results);
      }, 1500); // Add a loading delay before showing real data
    }
  }, [results, hasResults, animationState.hasInitialized]);
  
  const startAnimations = (results: PlatformResult[]) => {
    // First show the card container (already visible)
    
    // Then show the title with a small delay
    setTimeout(() => {
      setAnimationState(prev => ({ ...prev, titleVisible: true }));
    }, 300);
    
    // Start showing rows one by one
    results.forEach((_, index) => {
      setTimeout(() => {
        setAnimationState(prev => ({ 
          ...prev, 
          visibleRows: [...prev.visibleRows, index] 
        }));
      }, 600 + (index * 200)); // Faster animation sequence
    });
    
    // Finally show the legend and footer
    setTimeout(() => {
      setAnimationState(prev => ({ ...prev, legendVisible: true }));
    }, 600 + (results.length * 200) + 200);
    
    setTimeout(() => {
      setAnimationState(prev => ({ ...prev, footerVisible: true }));
    }, 600 + (results.length * 200) + 400);
  };
  
  // Reset animation state - useful if component needs to re-animate
  const resetAnimations = () => {
    setAnimationState({
      visibleRows: [],
      cardVisible: false,
      titleVisible: false,
      legendVisible: false,
      footerVisible: false,
      hasInitialized: false,
      isLoading: true
    });
  };

  return {
    ...animationState,
    resetAnimations
  };
};

export default useRatingsAnimation;
