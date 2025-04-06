
import React, { useState, useEffect, useRef } from 'react';
import { useGooglePlaces, PlaceSelectionResult } from '@/hooks/useGooglePlaces';
import { injectGooglePlacesStyles, fixPacContainerVisibility, showAutocompleteDropdown } from '@/utils/googlePlacesStyles';
import LocationInput from '@/components/LocationInput';
import StatusMessage from '@/components/StatusMessage';

interface LocationSelectorProps {
  onSelect: (location: string, placeData?: PlaceSelectionResult, apifyResult?: any) => void;
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
    scriptLoading,
    selectedPlace
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
      
      // Ensure dropdown visibility is properly set
      fixPacContainerVisibility();
    }
    
    return () => {
      cleanupAutocomplete();
    };
  }, [isLoaded]);

  // Handle when selectedPlace changes
  useEffect(() => {
    if (selectedPlace) {
      console.log("Selected Place with categories:", selectedPlace);
      const locationText = selectedPlace.address || selectedPlace.name || '';
      if (locationText) {
        setSearchTerm(locationText);
        
        // When we have a selected place, pass it to the parent
        onSelect(locationText, selectedPlace);
        
        // Hide the dropdown after selection
        showAutocompleteDropdown(false);
      }
    }
  }, [selectedPlace, onSelect]);

  // Handle search term changes
  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
    console.log('Input changed:', value);
    
    // Show the dropdown when user is typing
    if (isLoaded && value) {
      showAutocompleteDropdown(true);
    }
    
    // For manual entries (not from autocomplete)
    if (value.includes(',') && !selectedPlace) {
      onSelect(value);
      // Hide dropdown for manual entries with commas
      showAutocompleteDropdown(false);
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    console.log('Input focused');
    // Show dropdown on focus if there's text
    if (searchTerm) {
      showAutocompleteDropdown(true);
    }
  };

  return (
    <div className="relative w-full animate-fade-in z-1">
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
