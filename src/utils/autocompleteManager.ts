
import { PlaceSelectionResult } from '@/hooks/useGooglePlaces.types';

export interface AutocompleteOptions {
  countryRestrictions?: string[];
  types?: string[];
}

export const initializeAutocomplete = (
  inputElement: HTMLInputElement,
  options: AutocompleteOptions,
  onPlaceSelected: (place: PlaceSelectionResult) => void
): google.maps.places.Autocomplete | null => {
  try {
    console.log('Attempting to initialize autocomplete...');
    
    // Verify the Places library is available
    if (!window.google?.maps?.places?.Autocomplete) {
      console.error('Google Places API not available');
      return null;
    }
    
    // Create new autocomplete instance with expanded fields
    const autocomplete = new google.maps.places.Autocomplete(inputElement, {
      fields: [
        'address_components', 
        'formatted_address', 
        'geometry', 
        'name',
        'business_status',
        'formatted_phone_number',
        'types',
        'website',
        'place_id',
        'opening_hours'
      ],
      types: options.types,
      componentRestrictions: options.countryRestrictions?.length 
        ? { country: options.countryRestrictions } 
        : undefined
    });

    console.log('Autocomplete initialized with expanded fields');
    
    // Add listener for place selection
    const listener = google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      console.log('Place selected event:', place);
      
      if (place) {
        // Process categories: clean up Google Places types to be more user-friendly
        const rawTypes = place.types || [];
        const cleanedCategories = rawTypes
          .filter(type => !['point_of_interest', 'establishment'].includes(type))
          .map(type => {
            // Convert snake_case to Title Case
            return type
              .split('_')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
          });
        
        console.log("Extracted categories from Google Places:", cleanedCategories);
        
        // Extract and structure the place data
        const placeData: PlaceSelectionResult = {
          name: place.name,
          address: place.formatted_address,
          phoneNumber: place.formatted_phone_number,
          businessStatus: place.business_status,
          categories: cleanedCategories.length > 0 ? cleanedCategories : place.types,
          isOperational: place.opening_hours?.isOpen?.() ?? undefined,
          website: place.website,
          placeId: place.place_id,
          geometry: place.geometry?.location ? {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          } : undefined
        };
        
        console.log('Extracted place data with categories:', placeData);
        onPlaceSelected(placeData);
      }
    });
    
    console.log('Place changed listener added');
    return autocomplete;
  } catch (error) {
    console.error('Error initializing Google Places Autocomplete:', error);
    return null;
  }
};

export const cleanupAutocomplete = (
  autocomplete: google.maps.places.Autocomplete | null,
  listener: google.maps.MapsEventListener | null
): void => {
  // Remove the place_changed listener if it exists
  if (listener) {
    listener.remove();
    console.log('Autocomplete listener removed');
  }
  
  // Clear instance listeners on the autocomplete object
  if (autocomplete) {
    google.maps.event.clearInstanceListeners(autocomplete);
    console.log('Autocomplete instance cleaned up');
  }
};
