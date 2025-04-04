
import React from 'react';
import { cn } from '@/lib/utils';

interface ConversationBubbleProps {
  children: React.ReactNode;
  className?: string;
}

const ConversationBubble: React.FC<ConversationBubbleProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div 
      className={cn(
        "px-8 py-12 min-h-[500px] flex flex-col justify-between rounded-xl border border-gray-700/50 shadow-xl text-white animate-fade-in w-full max-w-4xl",
        "bg-gradient-to-br from-brand-gray-dark/90 to-brand-blue-dark/30",
        "backdrop-blur-lg",
        "shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.07)]",
        className
      )}
    >
      {children}
    </div>
  );
};

export default ConversationBubble;
