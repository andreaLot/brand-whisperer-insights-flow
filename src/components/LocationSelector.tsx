
import React, { useState, useEffect, useRef } from 'react';
import { useGooglePlaces } from '@/hooks/useGooglePlaces';
import { injectGooglePlacesStyles, fixPacContainerVisibility } from '@/utils/googlePlacesStyles';
import LocationInput from '@/components/LocationInput';
import StatusMessage from '@/components/StatusMessage';

interface LocationSelectorProps {
  onSelect: (location: string) => void;
  countryRestrictions?: string[];
  types?: string[];
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  onSelect, 
  countryRestrictions = ['us'],
  types = ['establishment', 'geocode']
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    isLoaded,
    placesFailed,
    initAutocomplete,
    cleanupAutocomplete,
    scriptLoading
  } = useGooglePlaces({
    countryRestrictions,
    types
  });

  // Inject custom styles for the autocomplete dropdown
  useEffect(() => {
    injectGooglePlacesStyles();
  }, []);

  // Initialize autocomplete when the script is loaded and the input is available
  useEffect(() => {
    if (isLoaded && inputRef.current) {
      initAutocomplete(inputRef.current);
      
      // Fix visibility after initialization
      fixPacContainerVisibility();
    }
    
    return () => {
      cleanupAutocomplete();
    };
  }, [isLoaded]);

  // Handle search term changes
  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
    console.log('Input changed:', value);
    
    // Check if this might be a place selection (e.g., from clicking an autocomplete suggestion)
    if (value.includes(',')) {
      onSelect(value);
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    console.log('Input focused');
    fixPacContainerVisibility();
  };

  return (
    <div className="relative w-full animate-fade-in">
      <LocationInput
        value={searchTerm}
        onChange={handleSearchTermChange}
        onFocus={handleInputFocus}
        inputRef={inputRef}
        isLoading={scriptLoading}
      />
      
      <StatusMessage
        isLoading={!isLoaded && scriptLoading}
        hasError={placesFailed}
      />
    </div>
  );
};

export default LocationSelector;
