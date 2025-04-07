
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
        console.log("ChatbotStep: Triggering Google basics panel after delay");
        window.postMessage({ type: 'chatbot-selection', message: 'google-basics' }, '*');
      }, 2000); // Consistent 2 second delay
    }
  }, [isFinalPhase]);

  // Function to handle the CTA button click
  const handleShowBasics = useCallback(() => {
    console.log("GoogleBasicsHandler: Show basics button clicked");
    // Send the panel selection message
    window.postMessage({ type: 'chatbot-selection', message: 'google-basics' }, '*');
    // Also send the specific click event to show the profile data - making this more explicit now
    window.postMessage({ type: 'show-google-basics-click', detail: { timestamp: Date.now() } }, '*');
  }, []);

  // Return handler function via a hidden element's data attribute
  return (
    <div style={{ display: 'none' }}>
      <input type="hidden" data-show-basics={handleShowBasics} />
    </div>
  );
};

export default GoogleBasicsHandler;
