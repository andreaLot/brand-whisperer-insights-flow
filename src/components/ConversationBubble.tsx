
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
        "p-8 rounded-xl border border-gray-700/50 shadow-xl text-white animate-fade-in w-full",
        "bg-gradient-to-br from-brand-gray-dark/90 to-brand-blue-dark/30",
        "backdrop-blur-lg",
        className
      )}
    >
      {children}
    </div>
  );
};

export default ConversationBubble;
