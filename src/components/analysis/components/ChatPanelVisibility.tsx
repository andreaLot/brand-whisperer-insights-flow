
import React, { useEffect } from 'react';

interface ChatPanelVisibilityProps {
  isPanelVisible: boolean;
  introComplete: boolean;
  setIsPanelVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatPanelVisibility: React.FC<ChatPanelVisibilityProps> = ({
  isPanelVisible,
  introComplete,
  setIsPanelVisible
}) => {
  // Don't force the ratings panel to appear on initial load anymore
  useEffect(() => {
    console.log("ChatbotStep: Initial render");
    
    // If we're not in the intro sequence yet, mark the panel as visible
    if (!introComplete) {
      setIsPanelVisible(true);
    }
  }, [introComplete, setIsPanelVisible]);

  return (
    <input type="hidden" data-panel-visible={isPanelVisible} />
  );
};

export default ChatPanelVisibility;
