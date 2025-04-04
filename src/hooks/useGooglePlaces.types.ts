
export interface UseGooglePlacesOptions {
  countryRestrictions?: string[];
  types?: string[];
}

export interface PlaceSelectionResult {
  name?: string;
  address?: string;
  phoneNumber?: string;
  businessStatus?: string;
  categories?: string[];
  isOperational?: boolean;
  website?: string;
  placeId?: string;
  geometry?: {
    lat?: number;
    lng?: number;
  };
}

export interface UseGooglePlacesReturn {
  isLoaded: boolean;
  placesFailed: boolean;
  initAutocomplete: (inputElement: HTMLInputElement) => void;
  cleanupAutocomplete: () => void;
  scriptLoading: boolean;
  selectedPlace: PlaceSelectionResult | null;
  apifyBusinessResult: any | null;
}
