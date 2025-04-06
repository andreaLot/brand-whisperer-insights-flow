
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
      
      // After 2 seconds, also trigger the Google basics panel
      setTimeout(() => {
        window.postMessage({ type: 'chatbot-selection', message: 'google-basics' }, '*');
      }, 2000);
    }
  }, [isFinalPhase]);

  // Function to handle the CTA button click
  const handleShowBasics = useCallback(() => {
    console.log("GoogleBasicsHandler: Show basics button clicked");
    window.postMessage({ type: 'chatbot-selection', message: 'google-basics' }, '*');
  }, []);

  // Return null as this component doesn't render anything visible
  // but make the handler function available via React.Children.only in the parent
  return (
    <div style={{ display: 'none' }}>
      {/* This is an invisible component that exports its handler function */}
      <input type="hidden" data-show-basics={handleShowBasics} />
    </div>
  );
};

export default GoogleBasicsHandler;
