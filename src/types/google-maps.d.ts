
declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          Autocomplete: new (
            inputElement: HTMLInputElement,
            options?: {
              fields: string[];
              types?: string[];
              componentRestrictions?: { country: string[] };
            }
          ) => google.maps.places.Autocomplete;
        };
        event: {
          addListener: (
            instance: any,
            eventName: string,
            handler: Function
          ) => google.maps.MapsEventListener;
          clearInstanceListeners: (instance: any) => void;
        };
      };
    };
  }

  namespace google.maps {
    interface MapsEventListener {
      remove: () => void;
    }
    
    namespace places {
      interface Autocomplete {
        getPlace: () => PlaceResult;
      }
      
      interface PlaceResult {
        address_components?: AddressComponent[];
        formatted_address?: string;
        geometry?: PlaceGeometry;
        name?: string;
        photos?: PlacePhoto[];
        place_id?: string;
        plus_code?: PlusCode;
        types?: string[];
        url?: string;
        utc_offset_minutes?: number;
        vicinity?: string;
        business_status?: string;
        formatted_phone_number?: string;
        international_phone_number?: string;
        opening_hours?: {
          isOpen?: () => boolean;
          periods?: any[];
          weekday_text?: string[];
        };
        website?: string;
        price_level?: number;
        rating?: number;
        user_ratings_total?: number;
      }
      
      interface AddressComponent {
        long_name: string;
        short_name: string;
        types: string[];
      }
      
      interface PlaceGeometry {
        location?: google.maps.LatLng;
        viewport?: google.maps.LatLngBounds;
      }
      
      interface PlacePhoto {
        height: number;
        html_attributions: string[];
        width: number;
        getUrl(opts: PhotoOptions): string;
      }
      
      interface PhotoOptions {
        maxHeight?: number;
        maxWidth?: number;
      }
      
      interface PlusCode {
        compound_code: string;
        global_code: string;
      }
    }

    // Add LatLngBoundsLiteral interface
    interface LatLngBoundsLiteral {
      east: number;
      north: number;
      south: number;
      west: number;
    }

    interface MapsEventListener {
      remove(): void;
    }
  }
}

export {};
