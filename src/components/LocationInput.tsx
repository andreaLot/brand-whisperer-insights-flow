
import React from 'react';
import { Input } from "@/components/ui/input";
import { MapPin } from 'lucide-react';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isLoading?: boolean;
}

const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  onFocus,
  inputRef,
  isLoading = false
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative group" id="location-input-container" style={{ zIndex: 1 }}>
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-light/10 to-brand-blue/5 rounded-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-blue-light group-hover:text-brand-blue transition-colors" size={18} />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Enter a location"
          value={value}
          onChange={handleInputChange}
          onFocus={onFocus}
          onClickCapture={onFocus}
          className="pl-10 py-6 bg-brand-gray-dark/80 text-white border border-gray-700 hover:border-brand-blue-light/50 focus:border-brand-blue-light rounded-md w-full focus:ring-2 focus:ring-brand-blue-light/30 transition-all backdrop-blur-sm shadow-lg"
          autoComplete="off" // Prevent browser's default autocomplete from interfering
          disabled={isLoading}
        />
      </div>
      
      {/* Light effect */}
      <div className="absolute -bottom-4 -left-4 -right-4 h-px bg-gradient-to-r from-transparent via-brand-blue-light/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
};

export default LocationInput;
