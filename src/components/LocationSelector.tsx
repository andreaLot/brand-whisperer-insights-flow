import React, { useState, useEffect, useRef } from 'react';
import { useGooglePlaces, PlaceSelectionResult } from '@/hooks/useGooglePlaces';
import { injectGooglePlacesStyles, fixPacContainerVisibility, showAutocompleteDropdown, hideAutocompleteDropdown } from '@/utils/googlePlacesStyles';
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

  useEffect(() => {
    injectGooglePlacesStyles();
  }, []);

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      initAutocomplete(inputRef.current);
      fixPacContainerVisibility();
    }
    
    return () => {
      cleanupAutocomplete();
    };
  }, [isLoaded]);

  useEffect(() => {
    if (selectedPlace) {
      console.log("Selected Place with categories:", selectedPlace);
      const locationText = selectedPlace.address || selectedPlace.name || '';
      if (locationText) {
        setSearchTerm(locationText);
        onSelect(locationText, selectedPlace);
        
        // Ensure dropdown is completely hidden after selection
        hideAutocompleteDropdown();
      }
    }
  }, [selectedPlace, onSelect]);

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
    console.log('Input changed:', value);
    
    if (isLoaded) {
      showAutocompleteDropdown(true);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
    
    if (value.includes(',') && !selectedPlace) {
      onSelect(value);
      // Ensure dropdown is completely hidden for manual entries
      hideAutocompleteDropdown();
    }
  };

  const handleInputFocus = () => {
    console.log('Input focused');
    showAutocompleteDropdown(true);
  };

  return (
    <div className="relative w-full animate-fade-in" style={{ zIndex: 1 }}>
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
