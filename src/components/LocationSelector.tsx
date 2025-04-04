
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin } from 'lucide-react';

interface LocationOption {
  id: string;
  name: string;
}

interface LocationSelectorProps {
  onSelect: (location: string) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locations, setLocations] = useState<LocationOption[]>([
    { id: '1', name: 'New York, NY' },
    { id: '2', name: 'Los Angeles, CA' },
    { id: '3', name: 'Chicago, IL' },
    { id: '4', name: 'Houston, TX' },
    { id: '5', name: 'Phoenix, AZ' }
  ]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
    
    // In a real app, you would fetch locations based on the search term
    // This is just a simulation
    if (e.target.value.trim() === '') {
      setLocations([
        { id: '1', name: 'New York, NY' },
        { id: '2', name: 'Los Angeles, CA' },
        { id: '3', name: 'Chicago, IL' },
        { id: '4', name: 'Houston, TX' },
        { id: '5', name: 'Phoenix, AZ' }
      ]);
    } else {
      const filtered = locations.filter(location =>
        location.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setLocations(filtered);
    }
  };

  const handleSelectLocation = (location: string) => {
    setSearchTerm(location);
    setIsOpen(false);
    onSelect(location);
  };

  return (
    <div className="relative w-full animate-fade-in">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Enter a location"
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => setIsOpen(true)}
          className="pl-10 py-6 bg-white text-black border-0 rounded-md w-full focus:ring-2 focus:ring-brand-blue transition-all"
        />
      </div>
      
      {isOpen && locations.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          <ul className="py-1">
            {locations.map((location) => (
              <li
                key={location.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-900 flex items-center"
                onClick={() => handleSelectLocation(location.name)}
              >
                <MapPin size={16} className="mr-2 text-brand-blue" />
                {location.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
