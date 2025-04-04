
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
        getPlace: () => {
          formatted_address?: string;
          geometry?: {
            location?: {
              lat: () => number;
              lng: () => number;
            };
          };
          name?: string;
          address_components?: any[];
        };
      }
    }
  }
}

export {};
