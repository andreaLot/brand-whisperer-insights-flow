
// Custom CSS for Google Places Autocomplete dropdown
// This will be injected once when the component mounts
export const injectGooglePlacesStyles = () => {
  // Only inject if not already present
  if (!document.getElementById('google-places-autocomplete-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'google-places-autocomplete-styles';
    styleElement.innerHTML = `
      .pac-container {
        z-index: 2 !important; /* Lower z-index so it doesn't go above the video */
        position: absolute !important;
        display: block !important;
        background-color: rgba(30, 30, 30, 0.85) !important;
        color: white !important;
        border: 1px solid rgba(76, 154, 255, 0.2) !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
        margin-top: 4px !important;
        border-radius: 0.375rem !important;
        font-family: inherit !important;
        width: auto !important;
        min-width: 300px !important;
        overflow: visible !important;
        backdrop-filter: blur(12px) !important;
      }
      
      .pac-item {
        padding: 8px 12px !important;
        cursor: pointer !important;
        color: #f3f4f6 !important;
        border-bottom: 1px solid rgba(76, 154, 255, 0.1) !important;
        display: flex !important;
        align-items: center !important;
        transition: all 0.2s ease !important;
      }
      
      .pac-item:hover {
        background-color: rgba(76, 154, 255, 0.15) !important;
      }
      
      .pac-icon {
        color: white !important;
      }
      
      .pac-item-query {
        color: white !important;
        font-size: 14px !important;
      }

      .pac-matched {
        color: #4C9AFF !important;
        font-weight: bold !important;
      }

      .pac-item-selected {
        background-color: rgba(76, 154, 255, 0.2) !important;
      }
      
      /* Hide Google attribution */
      .pac-logo:after {
        display: none !important;
      }
    `;
    document.head.appendChild(styleElement);
    console.log('Google Places Autocomplete styles injected');
  }
};

// Debug help function to check PAC container visibility
export const checkPacContainers = () => {
  const containers = document.querySelectorAll('.pac-container');
  console.log(`Found ${containers.length} PAC containers`);
  containers.forEach((container, i) => {
    const style = window.getComputedStyle(container as HTMLElement);
    console.log(`Container ${i}:`, {
      display: style.display,
      visibility: style.visibility,
      zIndex: style.zIndex,
      position: style.position,
      width: style.width,
      clientRect: (container as HTMLElement).getBoundingClientRect()
    });
  });
};

// Function to fix PAC container visibility issues
export const fixPacContainerVisibility = () => {
  setTimeout(() => {
    const containers = document.querySelectorAll('.pac-container');
    console.log('PAC containers found:', containers.length);
    containers.forEach(container => {
      (container as HTMLElement).style.zIndex = '2'; // Lower z-index
      (container as HTMLElement).style.position = 'absolute';
      (container as HTMLElement).style.display = 'block';
      (container as HTMLElement).style.backdropFilter = 'blur(12px)';
    });
    // Debug check of containers
    checkPacContainers();
  }, 100);
};
