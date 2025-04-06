
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
        "px-8 py-12 min-h-[500px] flex flex-col justify-between rounded-xl border border-gray-700/50 shadow-xl text-white animate-fade-in w-full max-w-4xl",
        "bg-gradient-to-br from-brand-gray-dark/90 to-brand-blue-dark/30",
        "backdrop-blur-lg",
        "shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.07)]",
        className
      )}
      initial={{ opacity: 0, y: 20, boxShadow: "0 8px 12px rgba(0,0,0,0.1)" }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        boxShadow: "0 16px 40px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.07)"
      }}
      transition={{ 
        duration: 0.7,
        ease: [0.19, 1.0, 0.22, 1.0] // Nice easing curve for elegant motion
      }}
    >
      {/* Decorative gradient elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-r from-violet-600/10 to-fuchsia-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-r from-blue-600/10 to-cyan-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-gradient-to-r from-indigo-600/5 to-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </motion.div>
  );
};

export default ConversationBubble;
