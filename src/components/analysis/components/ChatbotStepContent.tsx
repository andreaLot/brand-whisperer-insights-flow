
import React from 'react';
import { AnimatePresence } from "framer-motion";
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
  return (
    <div className="flex flex-col space-y-4 w-full">
      <h2 className="text-3xl font-bold">
        AI Platform <span className="text-brand-blue-light">Rankings</span>
      </h2>
      
      <div className="flex-1 overflow-auto p-4 bg-brand-black/50 rounded-lg h-[300px] overflow-y-auto">
        <ChatMessages 
          chatHistory={chatHistory} 
          isTyping={isTyping} 
          onShowBasics={onShowBasics}
        />
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
