
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
              text: `I've identified the top competitors for ${categoryText} in ${locationText}. Would you like to know more about their online presence or get SEO recommendations?`
            };
            nextStage = 'competitors';
          } else {
            newBotMessage = {
              type: 'bot',
              text: `Based on our analysis, here are some key SEO opportunities for ${categoryText} in ${locationText}. Would you like to see your competitor analysis next or see the full results?`
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

  // Determine which buttons to show based on the current stage
  const getButtons = () => {
    switch (currentStage) {
      case 'initial':
        return (
          <>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-brand-blue-dark hover:bg-brand-blue"
              onClick={() => handleButtonClick("Show me my competitors")}
            >
              <ChevronRight size={16} />
              <span>Show me my competitors</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-brand-blue-dark hover:bg-brand-blue"
              onClick={() => handleButtonClick("SEO opportunities")}
            >
              <ChevronRight size={16} />
              <span>SEO opportunities</span>
            </Button>
          </>
        );
        
      case 'competitors':
        return (
          <>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-brand-blue-dark hover:bg-brand-blue"
              onClick={() => handleButtonClick("Online presence details")}
            >
              <ChevronRight size={16} />
              <span>Online presence details</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-brand-blue-dark hover:bg-brand-blue"
              onClick={() => handleButtonClick("SEO recommendations")}
            >
              <ChevronRight size={16} />
              <span>SEO recommendations</span>
            </Button>
          </>
        );
        
      case 'seo':
        return (
          <>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-brand-blue-dark hover:bg-brand-blue"
              onClick={() => handleButtonClick("Competitor analysis")}
            >
              <ChevronRight size={16} />
              <span>Competitor analysis</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-brand-blue-dark hover:bg-brand-blue"
              onClick={() => handleButtonClick("Content strategy tips")}
            >
              <ChevronRight size={16} />
              <span>Content strategy tips</span>
            </Button>
          </>
        );
        
      case 'final':
        return (
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-brand-blue-dark hover:bg-brand-blue"
            onClick={() => handleButtonClick("Show full results")}
          >
            <Check size={16} />
            <span>Show full results</span>
          </Button>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 mb-4 space-y-4 overflow-y-auto max-h-[350px]">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.type === 'bot' ? 'justify-start' : 'justify-end'}`}
          >
            {message.type === 'bot' && <RobotAvatar />}
            
            <div 
              className={`px-4 py-2 rounded-lg max-w-[80%] ${
                message.type === 'bot' 
                  ? 'ml-2 bg-brand-gray-dark border border-gray-700' 
                  : 'mr-2 bg-brand-blue-dark'
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
            
            {message.type === 'user' && (
              <div className="w-10 h-10 bg-brand-blue-light rounded-full flex items-center justify-center">
                <Check size={20} />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {showButtons && (
        <div className="flex flex-col gap-3 mt-auto">
          {getButtons()}
        </div>
      )}
    </div>
  );
};

export default ChatbotStep;
