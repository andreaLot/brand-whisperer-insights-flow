
// Custom CSS for Google Places Autocomplete dropdown
// This will be injected once when the component mounts
export const injectGooglePlacesStyles = () => {
  // Only inject if not already present
  if (!document.getElementById('google-places-autocomplete-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'google-places-autocomplete-styles';
    styleElement.innerHTML = `
      .pac-container {
        z-index: 1000 !important; /* Much higher z-index to ensure visibility */
        position: absolute !important;
        display: block !important; /* Ensure it's displayed by default */
        background-color: #1e1e1e !important;
        color: white !important;
        border: 1px solid #333 !important;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5) !important;
        margin-top: 4px !important;
        border-radius: 0.375rem !important;
        font-family: inherit !important;
        width: auto !important;
        min-width: 300px !important;
        overflow: visible !important;
        opacity: 1 !important;
        visibility: visible !important;
      }
      
      .pac-item {
        padding: 8px 12px !important;
        cursor: pointer !important;
        color: #f3f4f6 !important;
        border-bottom: 1px solid #333 !important;
        display: flex !important;
        align-items: center !important;
      }
      
      .pac-item:hover {
        background-color: #333 !important;
      }
      
      .pac-icon {
        color: white !important;
      }
      
      .pac-item-query {
        color: white !important;
        font-size: 14px !important;
      }

      .pac-matched {
        color: #8b5cf6 !important;
        font-weight: bold !important;
      }

      .pac-item-selected {
        background-color: #374151 !important;
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
      (container as HTMLElement).style.zIndex = '1000'; /* Much higher z-index to ensure visibility */
      (container as HTMLElement).style.position = 'absolute';
      (container as HTMLElement).style.visibility = 'visible';
      (container as HTMLElement).style.display = 'block'; // Ensure it's visible
      (container as HTMLElement).style.opacity = '1';
    });
    // Debug check of containers
    checkPacContainers();
  }, 100);
};

// Function to show autocomplete only when explicitly needed
export const showAutocompleteDropdown = (show: boolean = true) => {
  setTimeout(() => {
    const containers = document.querySelectorAll('.pac-container');
    console.log(`${show ? 'Showing' : 'Hiding'} ${containers.length} autocomplete containers`);
    containers.forEach(container => {
      (container as HTMLElement).style.display = show ? 'block' : 'none';
      // Force reflow to ensure the display change takes effect
      void (container as HTMLElement).offsetHeight;
    });
  }, 50);
};
