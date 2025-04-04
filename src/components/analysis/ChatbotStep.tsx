
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import RobotAvatar from "@/components/RobotAvatar";
import { Check, ChevronRight } from "lucide-react";

interface ChatbotStepProps {
  primaryCategory?: string;
  location?: string;
  onChatComplete: () => void;
}

// Define the message type to enforce type safety
type MessageType = {
  type: 'bot' | 'user';
  text: string;
};

const ChatbotStep: React.FC<ChatbotStepProps> = ({ 
  primaryCategory, 
  location, 
  onChatComplete 
}) => {
  const categoryText = primaryCategory || "your business";
  const locationText = location || "your location";
  
  const [messages, setMessages] = useState<MessageType[]>([
    {
      type: 'bot',
      text: `We've analyzed ${categoryText} in ${locationText} and found some interesting insights. What would you like to know first?`
    }
  ]);
  
  const [showButtons, setShowButtons] = useState(true);
  const [currentStage, setCurrentStage] = useState<'initial' | 'competitors' | 'seo' | 'final'>('initial');
  
  const handleButtonClick = (buttonText: string) => {
    // Add user message based on button selection
    const newUserMessage: MessageType = {
      type: 'user',
      text: buttonText
    };
    
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setShowButtons(false);
    
    // Broadcast the button selection to the InputPanel
    window.postMessage({ type: 'chatbot-selection', message: buttonText }, '*');
    
    // Define response and next stage based on current stage
    setTimeout(() => {
      let newBotMessage: MessageType;
      let nextStage: 'initial' | 'competitors' | 'seo' | 'final';
      
      switch (currentStage) {
        case 'initial':
          if (buttonText.includes('competitors')) {
            newBotMessage = {
              type: 'bot',
              text: `I've identified the top competitors for ${categoryText} in ${locationText}. Would you like to know more about their online presence?`
            };
            nextStage = 'competitors';
          } else {
            newBotMessage = {
              type: 'bot',
              text: `Based on our analysis, here are some key SEO opportunities for ${categoryText} in ${locationText}. Would you like to see your competitor analysis next?`
            };
            nextStage = 'seo';
          }
          break;
          
        case 'competitors':
        case 'seo':
          newBotMessage = {
            type: 'bot',
            text: "Great! I've compiled all the insights and recommendations. Would you like to see the full analysis results now?"
          };
          nextStage = 'final';
          break;
          
        case 'final':
          newBotMessage = {
            type: 'bot',
            text: "Excellent! I'll show you the complete analysis results right away."
          };
          nextStage = 'final';
          // Proceed to show final results
          setTimeout(() => {
            onChatComplete();
          }, 1500);
          break;
          
        default:
          newBotMessage = {
            type: 'bot',
            text: "What would you like to know next?"
          };
          nextStage = 'initial';
      }
      
      setMessages(prevMessages => [...prevMessages, newBotMessage]);
      setCurrentStage(nextStage);
      setShowButtons(true);
    }, 1000);
  };

  // Get the appropriate button text based on the current stage
  const getButtonText = () => {
    switch (currentStage) {
      case 'initial':
        return "Show me my competitors";
      case 'competitors':
        return "Show SEO recommendations";
      case 'seo':
        return "See competitor analysis";
      case 'final':
        return "Show full results";
      default:
        return "Continue";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 mb-4 space-y-4 overflow-y-auto max-h-[350px] pr-2">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.type === 'bot' ? 'justify-start' : 'justify-end'} animate-fade-in`}
          >
            {message.type === 'bot' && <RobotAvatar />}
            
            <div 
              className={`px-4 py-3 rounded-lg max-w-[80%] shadow-lg transition-all duration-300 ${
                message.type === 'bot' 
                  ? 'ml-2 bg-gradient-to-br from-brand-gray-dark to-brand-blue-dark/70 border border-gray-700/50' 
                  : 'mr-2 bg-gradient-to-br from-brand-blue-dark to-brand-blue/40 border border-brand-blue-light/20'
              }`}
              style={{
                boxShadow: message.type === 'bot' 
                  ? '0 4px 12px rgba(0,0,0,0.2), inset 0 1px rgba(255,255,255,0.07)' 
                  : '0 4px 12px rgba(0,82,204,0.15), inset 0 1px rgba(255,255,255,0.1)'
              }}
            >
              <p className="text-sm">{message.text}</p>
            </div>
            
            {message.type === 'user' && (
              <div className="w-10 h-10 bg-gradient-to-br from-brand-blue-light to-brand-blue rounded-full flex items-center justify-center shadow-lg">
                <Check size={20} />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {showButtons && (
        <div className="mt-auto">
          <Button 
            onClick={() => handleButtonClick(getButtonText())}
            variant="dynamic" 
            size="xl" 
            className="w-full md:w-auto shadow-[0_4px_14px_rgba(0,82,204,0.4)]"
            style={{
              transition: "all 0.3s ease",
              transform: "translateY(0)",
            }}
          >
            {getButtonText()}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatbotStep;
