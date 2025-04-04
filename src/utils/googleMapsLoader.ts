
import { useToast } from "@/hooks/use-toast";

let scriptLoaded = false;

export const checkIfGoogleMapsLoaded = (): boolean => {
  return !!window.google?.maps?.places?.Autocomplete;
};

export const loadGoogleMapsScript = (
  onLoad: () => void,
  onError: () => void
): void => {
  // If already loaded, just call the callback
  if (checkIfGoogleMapsLoaded()) {
    console.log('Google Maps already loaded, initializing directly');
    onLoad();
    return;
  }

  // Don't add script if it's already in DOM
  if (document.getElementById('google-maps-script')) {
    return;
  }

  const script = document.createElement('script');
  script.id = 'google-maps-script';
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA48zqyAgIxKc6BsZHUwV7piqagv7nQPbw&libraries=places`;
  script.async = true;
  script.defer = true;
  
  script.onload = () => {
    console.log('Google Maps script loaded successfully');
    scriptLoaded = true;
    
    // Check if the Places library is available
    if (window.google?.maps?.places) {
      console.log('Places library available:', !!window.google.maps.places);
      onLoad();
    } else {
      console.error('Places library not available after script load');
      onError();
    }
  };
  
  script.onerror = (error) => {
    console.error('Failed to load Google Maps script:', error);
    onError();
  };
  
  document.head.appendChild(script);
};

export const useGoogleMapsLoader = () => {
  const { toast } = useToast();
  
  const handleLoadError = () => {
    toast({
      title: "Error loading location service",
      description: "Please check your internet connection and try again",
      variant: "destructive",
    });
  };
  
  return {
    handleLoadError,
    checkIfGoogleMapsLoaded,
    loadGoogleMapsScript
  };
};
