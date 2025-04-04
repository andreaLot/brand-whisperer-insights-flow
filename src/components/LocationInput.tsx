
import React, { useRef, useEffect } from 'react';
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
    <div className="relative" id="location-input-container">
      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      <Input
        ref={inputRef}
        type="text"
        placeholder="Enter a location"
        value={value}
        onChange={handleInputChange}
        onFocus={onFocus}
        onClickCapture={onFocus}
        className="pl-10 py-6 bg-brand-gray-dark text-white border border-gray-700 rounded-md w-full focus:ring-2 focus:ring-violet-500 transition-all"
        autoComplete="off" // Prevent browser's default autocomplete from interfering
        disabled={isLoading}
      />
    </div>
  );
};

export default LocationInput;
