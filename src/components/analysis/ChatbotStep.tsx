
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import ProgressIndicator from '@/components/ProgressIndicator';
import { MessageSquareMore } from 'lucide-react';
import { AnalysisService } from "@/services/AnalysisService";

interface ChatbotStepProps {
  primaryCategory?: string;
  location?: string;
  businessName: string;
  onChatComplete: () => void;
}

const ChatbotStep: React.FC<ChatbotStepProps> = ({ 
  primaryCategory, 
  location,
  businessName,
  onChatComplete 
}) => {
  const [step, setStep] = useState(0);
  const [webhookSent, setWebhookSent] = useState(false);

  useEffect(() => {
    // Progress through chatbot steps
    if (step === 0) {
      const timer = setTimeout(() => setStep(1), 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  useEffect(() => {
    // Send webhook data when the component mounts
    const sendData = async () => {
      if (!webhookSent && businessName && location) {
        try {
          const success = await AnalysisService.sendWebhookData({
            businessName,
            location: location || "Unknown Location",
            category: primaryCategory || "Unknown Category"
          });
          
          if (success) {
            console.log("Webhook data sent from ChatbotStep");
            setWebhookSent(true);
          }
        } catch (error) {
          console.error("Error sending webhook data from ChatbotStep:", error);
        }
      }
    };
    
    sendData();
  }, [businessName, location, primaryCategory, webhookSent]);

  // Button text based on the current step
  const getButtonText = () => {
    switch (step) {
      case 0:
        return "Analyzing the business...";
      case 1:
        return "Continue to Results";
      default:
        return "Continue";
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-brand-blue-light flex items-center gap-2">
          <MessageSquareMore size={22} />
          AI Brand Analysis
        </h2>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-brand-gray-dark to-brand-blue-dark/30 p-4 rounded-xl border border-gray-700 shadow-lg hover:shadow-brand-blue/10 transition-all duration-300">
            <p>Analyzing <span className="font-semibold text-brand-blue-light">{businessName}</span> in {location || "your location"}...</p>
          </div>
          
          {step >= 1 && (
            <div className="bg-gradient-to-br from-brand-gray-dark to-brand-blue-dark/30 p-4 rounded-xl border border-gray-700 shadow-lg hover:shadow-brand-blue/10 transition-all duration-300 animate-fade-in">
              <p>We're gathering insights on <span className="text-brand-blue-light">{primaryCategory}</span> businesses to provide you with a comprehensive analysis.</p>
            </div>
          )}
        </div>
      </div>
      
      <Button 
        onClick={onChatComplete}
        disabled={step < 1}
        variant="dynamic"
        size="xl"
        className="w-full animate-pulse shadow-md hover:shadow-xl transition-all duration-300"
      >
        {step === 0 ? (
          <span className="flex items-center gap-2">
            <ProgressIndicator currentStep={1} totalSteps={3} />
            {getButtonText()}
          </span>
        ) : (
          getButtonText()
        )}
      </Button>
    </div>
  );
};

export default ChatbotStep;
