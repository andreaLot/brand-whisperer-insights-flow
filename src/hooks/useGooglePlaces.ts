
import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
  UseGooglePlacesOptions, 
  PlaceSelectionResult,
  UseGooglePlacesReturn 
} from './useGooglePlaces.types';
import { loadGoogleMapsScript, checkIfGoogleMapsLoaded } from '@/utils/googleMapsLoader';
import { 
  initializeAutocomplete, 
  cleanupAutocomplete as cleanupAutocompleteUtil 
} from '@/utils/autocompleteManager';

export type { PlaceSelectionResult } from './useGooglePlaces.types';

export const useGooglePlaces = ({
  countryRestrictions = ['us'],
  types = ['establishment', 'geocode']
}: UseGooglePlacesOptions): UseGooglePlacesReturn => {
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  const [scriptLoading, setScriptLoading] = useState(false);
  const [placesFailed, setPlacesFailed] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceSelectionResult | null>(null);
  const [apifyBusinessResult, setApifyBusinessResult] = useState(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const listenerRef = useRef<google.maps.MapsEventListener | null>(null);

  // Load the Google Maps script
  useEffect(() => {
    // Prevent duplicate loading attempts
    if (scriptLoading) return;
    
    // Check if the script is already loaded
    if (checkIfGoogleMapsLoaded()) {
      console.log('Google Maps already loaded, initializing directly');
      setIsLoaded(true);
      return;
    }
    
    setScriptLoading(true);
    loadGoogleMapsScript(
      // onLoad callback
      () => {
        setIsLoaded(true);
        setScriptLoading(false);
      },
      // onError callback
      () => {
        setScriptLoading(false);
        setPlacesFailed(true);
        toast({
          title: "Error loading location service",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
      }
    );

    return () => {
      cleanupAutocomplete();
    };
  }, []);

  // Clean up autocomplete and listeners
  const cleanupAutocomplete = () => {
    cleanupAutocompleteUtil(autocompleteRef.current, listenerRef.current);
    autocompleteRef.current = null;
    listenerRef.current = null;
  };

  const initAutocomplete = (inputElement: HTMLInputElement) => {
    if (!isLoaded || !inputElement) {
      console.log('Not initializing autocomplete yet.', { isLoaded, hasInput: !!inputElement });
      return;
    }

    // Clean up previous autocomplete instance if it exists
    cleanupAutocomplete();
    
    const autocomplete = initializeAutocomplete(
      inputElement, 
      { countryRestrictions, types },
      (placeData) => {
        console.log("Place data from Google Places:", placeData);
        setSelectedPlace(placeData);
      }
    );
    
    if (!autocomplete) {
      setPlacesFailed(true);
      toast({
        title: "Location search unavailable",
        description: "Could not initialize location search",
        variant: "destructive",
      });
      return;
    }
    
    autocompleteRef.current = autocomplete;
    
    // Store a reference to the listener for cleanup
    // This is a workaround since we can't directly access the listener from initializeAutocomplete
    listenerRef.current = {
      remove: () => {
        if (autocompleteRef.current) {
          google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }
      }
    };
  };

  return {
    isLoaded,
    placesFailed,
    initAutocomplete,
    cleanupAutocomplete,
    scriptLoading,
    selectedPlace,
    apifyBusinessResult
  };
};
