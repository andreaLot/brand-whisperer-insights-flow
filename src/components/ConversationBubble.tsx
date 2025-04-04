
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
        "p-6 rounded-lg border border-brand-blue bg-brand-gray-dark text-white animate-fade-in",
        className
      )}
    >
      {children}
    </div>
  );
};

export default ConversationBubble;
