
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { MapPin } from 'lucide-react';

interface LocationSelectorProps {
  onSelect: (location: string) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Load the Google Maps script
  useEffect(() => {
    // Check if the script is already loaded
    if (!document.getElementById('google-maps-script')) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA48zqyAgIxKc6BsZHUwV7piqagv7nQPbw&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsLoaded(true);
        console.log('Google Maps script loaded successfully');
      };
      script.onerror = () => {
        console.error('Failed to load Google Maps script');
      };
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }

    return () => {
      // Clean up on unmount
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  // Initialize autocomplete when the script is loaded and the input is available
  useEffect(() => {
    if (isLoaded && inputRef.current) {
      try {
        autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
          fields: ['address_components', 'formatted_address', 'geometry', 'name']
        });

        console.log('Autocomplete initialized:', autocompleteRef.current);
        
        // Add listener for place selection
        const listener = google.maps.event.addListener(autocompleteRef.current, 'place_changed', () => {
          const place = autocompleteRef.current?.getPlace();
          if (place && place.formatted_address) {
            setSearchTerm(place.formatted_address);
            onSelect(place.formatted_address);
            console.log('Place selected:', place.formatted_address);
          }
        });
      } catch (error) {
        console.error('Error initializing Google Places Autocomplete:', error);
      }
    }
  }, [isLoaded, onSelect]);

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
        />
      </div>
      
      {/* We're using CSS already in App.css */}
      {/* Google Places styles are already defined in App.css */}
    </div>
  );
};

export default LocationSelector;
