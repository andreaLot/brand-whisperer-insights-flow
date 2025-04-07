
import { useState, useEffect } from 'react';
import { Step } from '@/components/analysis/ConversationPanel';

interface PanelSplitRatio {
  conversation: string;
  input: string;
}

export const usePanelSplit = (step: Step, isPanelCollapsed: boolean): PanelSplitRatio => {
  const [panelSplitRatio, setPanelSplitRatio] = useState<PanelSplitRatio>({
    conversation: '50%',
    input: '50%'
  });
  
  // Handle split ratio based on current step
  useEffect(() => {
    const updatePanelRatio = () => {
      if (step === 'welcome') {
        // Initial 50/50 split
        setPanelSplitRatio({
          conversation: '50%',
          input: '50%'
        });
      } else if (step === 'business-name' || step === 'category-detection' || step === 'analyzing') {
        // Transition to 45/55 split over 2 seconds (changed from 40/60)
        const transitionDuration = 2000; // 2 seconds
        let startTime: number;
        
        const animate = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / transitionDuration, 1);
          
          // Interpolate from 50/50 to 45/55 (changed from 40/60)
          const convWidth = 50 - (5 * progress); // 50% to 45%
          const inputWidth = 50 + (5 * progress); // 50% to 55%
          
          setPanelSplitRatio({
            conversation: `${convWidth}%`,
            input: `${inputWidth}%`
          });
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        requestAnimationFrame(animate);
      } else if (step === 'chatbot') {
        if (isPanelCollapsed) {
          // After selection, show 45/55 split for chat and ratings (changed from 40/60)
          setPanelSplitRatio({
            conversation: '45%',
            input: '55%'
          });
        } else {
          // Initially 50/50 split for chatbot before selection
          setPanelSplitRatio({
            conversation: '50%',
            input: '50%'
          });
        }
      }
    };
    
    updatePanelRatio();
  }, [step, isPanelCollapsed]);

  return panelSplitRatio;
};
