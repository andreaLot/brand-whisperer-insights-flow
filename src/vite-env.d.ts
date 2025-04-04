
/// <reference types="vite/client" />

// Google Maps API types
declare namespace google {
  namespace maps {
    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    class LatLngBounds {
      constructor(sw?: LatLng, ne?: LatLng);
      extend(point: LatLng): LatLngBounds;
    }

    namespace places {
      class Autocomplete {
        constructor(
          inputField: HTMLInputElement,
          opts?: AutocompleteOptions
        );
        addListener(eventName: string, handler: Function): google.maps.MapsEventListener;
        getPlace(): PlaceResult;
      }
      
      interface AutocompleteOptions {
        bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
        componentRestrictions?: ComponentRestrictions;
        fields?: string[];
        strictBounds?: boolean;
        types?: string[];
      }
      
      interface ComponentRestrictions {
        country: string | string[];
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

    interface MapsEventListener {
      remove(): void;
    }
  }
}
