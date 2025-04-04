
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
        "p-6 rounded-lg border border-gray-700 shadow-lg text-white animate-fade-in",
        "bg-gradient-to-br from-brand-gray-dark to-brand-blue-dark/20",
        "backdrop-blur-sm",
        className
      )}
    >
      {children}
    </div>
  );
};

export default ConversationBubble;
