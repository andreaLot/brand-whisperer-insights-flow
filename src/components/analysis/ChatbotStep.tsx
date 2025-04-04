
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquareMore, Bot, ArrowRight } from 'lucide-react';
import { AnalysisService } from "@/services/AnalysisService";
import { motion } from "framer-motion";

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
  const [buttonEnabled, setButtonEnabled] = useState(false);

  useEffect(() => {
    // Progress through chatbot steps with visual animation
    const timer = setTimeout(() => {
      setStep(1);
      setButtonEnabled(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-medium text-brand-blue-light flex items-center gap-2 mb-2">
          <Bot size={22} />
          AI Brand Analysis
        </h2>
        <p className="text-sm text-gray-400">
          We've gathered insights on your business's online presence
        </p>
      </div>
      
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-brand-gray-dark to-brand-blue-dark/30 p-4 rounded-xl border border-gray-700"
        >
          <div className="flex items-start gap-3">
            <div className="bg-brand-blue/20 p-1.5 rounded-full mt-0.5">
              <MessageSquareMore size={16} className="text-brand-blue-light" />
            </div>
            <p className="text-sm">
              Analyzing <span className="font-semibold text-brand-blue-light">{businessName}</span> in {location || "your location"}...
            </p>
          </div>
        </motion.div>
        
        {step >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-br from-brand-gray-dark to-brand-blue-dark/30 p-4 rounded-xl border border-gray-700"
          >
            <div className="flex items-start gap-3">
              <div className="bg-brand-blue/20 p-1.5 rounded-full mt-0.5">
                <Bot size={16} className="text-brand-blue-light" />
              </div>
              <div className="space-y-2">
                <p className="text-sm">
                  Analysis of <span className="text-brand-blue-light">{primaryCategory}</span> businesses is complete.
                </p>
                <p className="text-xs text-gray-400">
                  Ready to view your comprehensive brand analysis
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Button 
          onClick={onChatComplete}
          disabled={!buttonEnabled}
          variant="dynamic"
          size="lg"
          className="w-full transition-all duration-500 flex items-center justify-center gap-2"
        >
          Continue to Results 
          <ArrowRight size={16} />
        </Button>
      </motion.div>
    </div>
  );
};

export default ChatbotStep;
