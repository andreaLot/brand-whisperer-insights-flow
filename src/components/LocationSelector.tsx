
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
      
      // Make sure the dropdown is visible after initialization
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
    
    // Always show the dropdown when user is typing
    if (isLoaded) {
      showAutocompleteDropdown(true);
      // Force reflow to ensure dropdown visibility
      if (inputRef.current) {
        inputRef.current.focus();
      }
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
    // Always show dropdown on focus to ensure it's visible
    showAutocompleteDropdown(true);
  };

  return (
    <div className="relative w-full animate-fade-in" style={{ zIndex: 5 }}>
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
