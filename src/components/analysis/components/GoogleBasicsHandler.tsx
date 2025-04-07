
import React, { useCallback, useRef, useEffect } from 'react';

interface GoogleBasicsHandlerProps {
  isFinalPhase: boolean;
  onShowBasicsInit: (handler: () => void) => void;
}

const GoogleBasicsHandler: React.FC<GoogleBasicsHandlerProps> = ({ 
  isFinalPhase,
  onShowBasicsInit
}) => {
  // Create a ref to track if we've already sent the message
  const messagesSent = useRef(false);
  const hasInitialized = useRef(false);
  
  // Send message to show ratings panel when we're in final phase
  useEffect(() => {
    if (isFinalPhase && !messagesSent.current) {
      // Explicitly trigger the ratings panel to appear
      console.log("ChatbotStep: Triggering ratings panel (isFinalPhase effect)");
      window.postMessage({ type: 'chatbot-selection', message: 'ratings' }, '*');
      
      // Mark as sent to prevent multiple triggers
      messagesSent.current = true;
    }
  }, [isFinalPhase]);

  // Function to handle the CTA button click
  const handleShowBasics = useCallback(() => {
    console.log("GoogleBasicsHandler: Show basics button clicked");
    
    // First, explicitly set showGoogleBasics to true via event
    window.postMessage({ 
      type: 'show-google-basics-click', 
      detail: { timestamp: Date.now() } 
    }, '*');
    
    // Then send the panel selection message with a small delay 
    setTimeout(() => {
      console.log("GoogleBasicsHandler: Sending chatbot-selection for google-basics");
      window.postMessage({ type: 'chatbot-selection', message: 'google-basics' }, '*');
    }, 50);
  }, []);

  // Initialize the handler function
  useEffect(() => {
    if (!hasInitialized.current && onShowBasicsInit) {
      console.log("GoogleBasicsHandler: Initializing handler function");
      onShowBasicsInit(handleShowBasics);
      hasInitialized.current = true;
    }
  }, [onShowBasicsInit, handleShowBasics]);

  return null; // No need for a hidden element anymore
};

export default GoogleBasicsHandler;
