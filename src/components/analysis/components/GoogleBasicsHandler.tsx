
import React, { useCallback } from 'react';

interface GoogleBasicsHandlerProps {
  isFinalPhase: boolean;
}

const GoogleBasicsHandler: React.FC<GoogleBasicsHandlerProps> = ({ 
  isFinalPhase 
}) => {
  // Send message to show ratings panel when we're in final phase
  React.useEffect(() => {
    if (isFinalPhase) {
      // Explicitly trigger the ratings panel to appear
      console.log("ChatbotStep: Triggering ratings panel (isFinalPhase effect)");
      window.postMessage({ type: 'chatbot-selection', message: 'ratings' }, '*');
    }
  }, [isFinalPhase]);

  // Function to handle the CTA button click
  const handleShowBasics = useCallback(() => {
    window.postMessage({ type: 'chatbot-selection', message: 'google-basics' }, '*');
  }, []);

  return {
    handleShowBasics
  };
};

export default GoogleBasicsHandler;
