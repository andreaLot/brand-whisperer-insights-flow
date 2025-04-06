
import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BarChart2, Code } from "lucide-react";
import { WebhookService } from '@/services/WebhookService';

interface QuickOptionsProps {
  showOptions: boolean;
  isFinalPhase: boolean;
  onOptionClick: (message: string) => void;
  forceShow?: boolean;
}

const QuickOptions: React.FC<QuickOptionsProps> = ({ 
  showOptions, 
  isFinalPhase, 
  onOptionClick,
  forceShow = false
}) => {
  // Always show in chatbot step unless in final phase
  if ((!showOptions && !forceShow) || isFinalPhase) return null;

  const handleRatingsClick = () => {
    // Post message first to ensure panel shows immediately
    window.postMessage({ type: 'chatbot-selection', message: 'ratings' }, '*');
    
    // Then trigger the analysis by sending the message
    onOptionClick("Show me the current AI platform rankings");
  };
  
  const handleShowLastResponse = () => {
    const lastResponse = WebhookService.getLastReceivedResponse();
    if (lastResponse) {
      console.log("📋 Last N8N Response:", JSON.stringify(lastResponse, null, 2));
      
      // Display in a formatted way in console
      console.log("📊 [N8N] Last Response Summary:");
      console.log("--------------------------------------------------");
      
      if (Array.isArray(lastResponse)) {
        console.log(`Array response with ${lastResponse.length} platform results`);
        lastResponse.forEach((item, index) => {
          const platform = item.model ? WebhookService.normalizeModelToPlatform(item.model) : 'Unknown';
          console.log(`Platform ${index + 1}: ${platform} (${item.model || 'unknown'})`);
          
          if (item.choices && item.choices.length > 0) {
            const content = item.choices[0].message?.content;
            console.log(`Content: ${content}`);
          }
        });
      } else if (lastResponse.choices) {
        const model = lastResponse.model;
        const content = lastResponse.choices[0]?.message?.content;
        console.log(`Single platform: ${WebhookService.normalizeModelToPlatform(model)} (${model})`);
        console.log(`Content: ${content}`);
      } else {
        console.log("Unknown response format:", lastResponse);
      }
      
      console.log("--------------------------------------------------");
      onOptionClick("I've logged the last N8N response to the console");
    } else {
      onOptionClick("No N8N response has been received yet");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="flex flex-wrap gap-2 justify-center"
    >
      <Button
        variant="outline"
        size="lg"
        className="text-base bg-violet-500/30 border-violet-400 text-violet-100 hover:bg-violet-500/40 px-6 py-2 flex items-center gap-2"
        onClick={handleRatingsClick}
        data-testid="view-ratings-button"
      >
        <BarChart2 size={18} className="text-violet-300" />
        View AI Platform Rankings
      </Button>
      
      <Button
        variant="outline"
        size="lg"
        className="text-base bg-blue-500/30 border-blue-400 text-blue-100 hover:bg-blue-500/40 px-6 py-2 flex items-center gap-2"
        onClick={handleShowLastResponse}
        data-testid="view-n8n-response-button"
      >
        <Code size={18} className="text-blue-300" />
        Show Last N8N Response
      </Button>
    </motion.div>
  );
};

export default QuickOptions;
