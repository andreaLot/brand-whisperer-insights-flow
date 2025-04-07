
import React, { useRef, useEffect } from 'react';
import { AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessages from './ChatMessages';
import QuickOptions from './QuickOptions';
import { ChatMessage } from '../hooks/useChatbotState';

interface ChatbotStepContentProps {
  chatHistory: ChatMessage[];
  isTyping: boolean;
  showOptions: boolean;
  introComplete: boolean;
  isFinalPhase: boolean;
  onOptionClick: (message: string) => void;
  onShowBasics: () => void;
}

const ChatbotStepContent: React.FC<ChatbotStepContentProps> = ({
  chatHistory,
  isTyping,
  showOptions,
  introComplete,
  isFinalPhase,
  onOptionClick,
  onShowBasics
}) => {
  // Create a ref for auto-scrolling
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when chat history changes
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        setTimeout(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }, 100);
      }
    }
  }, [chatHistory, isTyping]);
  
  return (
    <div className="flex flex-col space-y-4 w-full">
      <h2 className="text-3xl font-bold">
        AI Platform <span className="text-uberall-rosa">Rankings</span>
      </h2>
      
      <div className="flex-1 bg-gradient-to-br from-uberall-dark-plum/60 to-uberall-dark-plum/40 rounded-lg h-[400px] shadow-xl border border-uberall-ultraviolet/30 backdrop-blur-sm">
        <ScrollArea className="h-full w-full pr-4" ref={scrollAreaRef}>
          <div className="p-4">
            <ChatMessages 
              chatHistory={chatHistory} 
              isTyping={isTyping} 
              onShowBasics={onShowBasics}
            />
          </div>
        </ScrollArea>
      </div>
      
      {/* Quick option buttons */}
      <AnimatePresence>
        <QuickOptions 
          showOptions={showOptions} 
          isFinalPhase={isFinalPhase} 
          onOptionClick={onOptionClick} 
          forceShow={introComplete && !isFinalPhase}
        />
      </AnimatePresence>
    </div>
  );
};

export default ChatbotStepContent;
