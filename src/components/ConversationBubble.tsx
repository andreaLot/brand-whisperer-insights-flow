
import React from 'react';
import { motion } from 'framer-motion';
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
    <motion.div 
      className={cn(
        "px-8 py-12 min-h-[500px] flex flex-col justify-between rounded-xl border border-uberall-ultraviolet/30 shadow-2xl text-white animate-fade-in w-full max-w-4xl",
        "bg-gradient-to-br from-uberall-dark-plum/90 to-uberall-ultraviolet/10",
        "backdrop-blur-lg",
        "shadow-[0_16px_48px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.1)]",
        className
      )}
      initial={{ opacity: 0, y: 20, boxShadow: "0 8px 12px rgba(0,0,0,0.1)" }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        boxShadow: "0 24px 56px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.1)"
      }}
      transition={{ 
        duration: 0.7,
        ease: [0.19, 1.0, 0.22, 1.0] // Nice easing curve for elegant motion
      }}
    >
      {/* Enhanced decorative gradient elements */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-r from-uberall-ultraviolet/20 to-uberall-rosa/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-r from-uberall-bright-blue/15 to-uberall-aqua/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-r from-uberall-rosa/10 to-uberall-ultraviolet/15 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </motion.div>
  );
};

export default ConversationBubble;
