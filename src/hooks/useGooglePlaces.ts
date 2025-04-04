
import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";

interface UseGooglePlacesOptions {
  countryRestrictions?: string[];
  types?: string[];
}

interface UseGooglePlacesReturn {
  isLoaded: boolean;
  placesFailed: boolean;
  initAutocomplete: (inputElement: HTMLInputElement) => void;
  cleanupAutocomplete: () => void;
  scriptLoading: boolean;
}

export const useGooglePlaces = ({
  countryRestrictions = ['us'],
  types = ['establishment', 'geocode']
}: UseGooglePlacesOptions): UseGooglePlacesReturn => {
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  const [scriptLoading, setScriptLoading] = useState(false);
  const [placesFailed, setPlacesFailed] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const listenerRef = useRef<google.maps.MapsEventListener | null>(null);

  // Load the Google Maps script
  useEffect(() => {
    // Prevent duplicate loading attempts
    if (scriptLoading) return;
    
    // Check if the script is already loaded
    if (window.google?.maps?.places?.Autocomplete) {
      console.log('Google Maps already loaded, initializing directly');
      setIsLoaded(true);
      return;
    }
    
    if (!document.getElementById('google-maps-script')) {
      setScriptLoading(true);
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA48zqyAgIxKc6BsZHUwV7piqagv7nQPbw&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google Maps script loaded successfully');
        setIsLoaded(true);
        setScriptLoading(false);
        
        // Check if the Places library is available
        if (window.google?.maps?.places) {
          console.log('Places library available:', !!window.google.maps.places);
        } else {
          console.error('Places library not available after script load');
          setPlacesFailed(true);
          toast({
            title: "Error loading location service",
            description: "Please try refreshing the page",
            variant: "destructive",
          });
        }
      };
      script.onerror = (error) => {
        console.error('Failed to load Google Maps script:', error);
        setScriptLoading(false);
        setPlacesFailed(true);
        toast({
          title: "Error loading location service",
          description: "Please check your internet connection and try again",
          variant: "destructive",
        });
      };
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }

    return () => {
      cleanupAutocomplete();
    };
  }, []);

  // Clean up autocomplete and listeners
  const cleanupAutocomplete = () => {
    // Remove the place_changed listener if it exists
    if (listenerRef.current) {
      listenerRef.current.remove();
      listenerRef.current = null;
      console.log('Autocomplete listener removed');
    }
    
    // Clear instance listeners on the autocomplete object
    if (autocompleteRef.current) {
      google.maps.event.clearInstanceListeners(autocompleteRef.current);
      autocompleteRef.current = null;
      console.log('Autocomplete instance cleaned up');
    }
  };

  const initAutocomplete = (inputElement: HTMLInputElement) => {
    if (!isLoaded || !inputElement) {
      console.log('Not initializing autocomplete yet.', { isLoaded, hasInput: !!inputElement });
      return;
    }

    try {
      console.log('Attempting to initialize autocomplete...');
      
      // Clean up previous autocomplete instance if it exists
      cleanupAutocomplete();
      
      // Verify the Places library is available
      if (!window.google?.maps?.places?.Autocomplete) {
        console.error('Google Places API not available');
        setPlacesFailed(true);
        toast({
          title: "Location search unavailable",
          description: "Could not initialize location search",
          variant: "destructive",
        });
        return;
      }
      
      // Create new autocomplete instance with options
      autocompleteRef.current = new google.maps.places.Autocomplete(inputElement, {
        fields: ['address_components', 'formatted_address', 'geometry', 'name'],
        types: types,
        componentRestrictions: countryRestrictions.length ? { country: countryRestrictions } : undefined
      });

      console.log('Autocomplete initialized with options:', { types, countryRestrictions });
      
      // Add listener for place selection and store reference to allow cleanup
      listenerRef.current = google.maps.event.addListener(autocompleteRef.current, 'place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        console.log('Place selected event:', place);
        if (place && place.formatted_address) {
          // We handle this through the input's change event now
          console.log('Place selected:', place.formatted_address);
        }
      });
      
      console.log('Place changed listener added');
    } catch (error) {
      console.error('Error initializing Google Places Autocomplete:', error);
      setPlacesFailed(true);
      toast({
        title: "Error setting up location search",
        description: "Please try again or enter location manually",
        variant: "destructive",
      });
    }
  };

  return {
    isLoaded,
    placesFailed,
    initAutocomplete,
    cleanupAutocomplete,
    scriptLoading
  };
};
