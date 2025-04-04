
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { MapPin } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface LocationSelectorProps {
  onSelect: (location: string) => void;
  countryRestrictions?: string[]; // Optional prop to restrict results to specific countries
  types?: string[]; // Optional prop to restrict to specific place types
}

// Custom CSS for Google Places Autocomplete dropdown
// This will be injected once when the component mounts
const injectGooglePlacesStyles = () => {
  // Only inject if not already present
  if (!document.getElementById('google-places-autocomplete-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'google-places-autocomplete-styles';
    styleElement.innerHTML = `
      .pac-container {
        z-index: 10000 !important;
        background-color: white !important;
        color: black !important;
        border: 1px solid #ccc !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        margin-top: 2px !important;
        border-radius: 0.375rem !important;
        font-family: inherit !important;
      }
      
      .pac-item {
        padding: 8px 12px !important;
        cursor: pointer !important;
      }
      
      .pac-item:hover {
        background-color: #f3f4f6 !important;
      }
      
      .pac-item-query {
        color: #000 !important;
        font-size: 14px !important;
      }
    `;
    document.head.appendChild(styleElement);
    console.log('Google Places Autocomplete styles injected');
  }
};

const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  onSelect, 
  countryRestrictions = ['us'], // Default to US
  types = ['establishment', 'geocode'] // Default to establishments and addresses
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [scriptLoading, setScriptLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const listenerRef = useRef<google.maps.MapsEventListener | null>(null);

  // Inject custom styles for the autocomplete dropdown
  useEffect(() => {
    injectGooglePlacesStyles();
    return () => {
      // Optional cleanup
      const styleElement = document.getElementById('google-places-autocomplete-styles');
      if (styleElement) {
        // Don't remove the styles on unmount as they may be needed by other instances
        // document.head.removeChild(styleElement);
      }
    };
  }, []);

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

    // Clean up function that will run when component unmounts
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

  // Initialize autocomplete when the script is loaded and the input is available
  useEffect(() => {
    if (!isLoaded || !inputRef.current) {
      console.log('Not initializing autocomplete yet.', { isLoaded, hasInput: !!inputRef.current });
      return;
    }

    try {
      console.log('Attempting to initialize autocomplete...');
      
      // Clean up previous autocomplete instance if it exists
      cleanupAutocomplete();
      
      // Verify the Places library is available
      if (!window.google?.maps?.places?.Autocomplete) {
        console.error('Google Places API not available');
        toast({
          title: "Location search unavailable",
          description: "Could not initialize location search",
          variant: "destructive",
        });
        return;
      }
      
      // Create new autocomplete instance with options
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
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
          setSearchTerm(place.formatted_address);
          onSelect(place.formatted_address);
          console.log('Place selected:', place.formatted_address);
        }
      });
      
      console.log('Place changed listener added');
      
      // Force the pac-container to have a higher z-index
      setTimeout(() => {
        const containers = document.querySelectorAll('.pac-container');
        console.log('PAC containers found:', containers.length);
        containers.forEach(container => {
          (container as HTMLElement).style.zIndex = '10000';
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error initializing Google Places Autocomplete:', error);
      toast({
        title: "Error setting up location search",
        description: "Please try again or enter location manually",
        variant: "destructive",
      });
    }
    
  }, [isLoaded, types, countryRestrictions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    console.log('Input changed:', e.target.value);
  };

  return (
    <div className="relative w-full animate-fade-in">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Enter a location"
          value={searchTerm}
          onChange={handleInputChange}
          className="pl-10 py-6 bg-white text-black border-0 rounded-md w-full focus:ring-2 focus:ring-brand-blue transition-all"
          autoComplete="off" // Prevent browser's default autocomplete from interfering
        />
      </div>
      {!isLoaded && (
        <div className="text-sm text-gray-500 mt-2">Loading location search...</div>
      )}
    </div>
  );
};

export default LocationSelector;
