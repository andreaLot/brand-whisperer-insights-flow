
export const extractCity = (address: string): string => {
  const cityMatch = address.match(/([A-Za-z\s]+),\s*[A-Z]{2}/);
  if (cityMatch && cityMatch[1]) {
    return cityMatch[1].trim();
  }
  
  const parts = address.split(',');
  return parts.length > 1 ? parts[1].trim() : address;
};
