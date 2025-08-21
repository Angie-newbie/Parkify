// export const fetchAddress = async (lat, lng) => {
//   const response = await fetch(
//     `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
//   );
//   const data = await response.json();
//   return data.display_name || "Address not found";
// };

// BigDataCloud Free Reverse Geocoding API (Client-side only)
export const fetchAddress = async (lat, lng) => {
  try {
    console.log(`🔍 Fetching address for coordinates: ${lat}, ${lng}`);
    
    // BigDataCloud Client-side API - completely free, no API key needed
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('📍 Geocoding response:', data);
    
    // Format the address nicely for Australian addresses
    const addressParts = [];
    
    // Street address
    if (data.streetNumber && data.streetName) {
      addressParts.push(`${data.streetNumber} ${data.streetName}`);
    } else if (data.streetName) {
      addressParts.push(data.streetName);
    }
    
    // Locality/Suburb
    if (data.locality) {
      addressParts.push(data.locality);
    } else if (data.city) {
      addressParts.push(data.city);
    }
    
    // State/Province
    if (data.principalSubdivision) {
      addressParts.push(data.principalSubdivision);
    }
    
    // Country
    if (data.countryName) {
      addressParts.push(data.countryName);
    }
    
    const formattedAddress = addressParts.join(', ');
    console.log('✅ Formatted address:', formattedAddress);
    
    return formattedAddress || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    
  } catch (error) {
    console.error('❌ Geocoding error:', error);
    
    // Fallback to coordinates if geocoding fails
    return `📍 ${Math.abs(lat).toFixed(4)}°${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(4)}°${lng >= 0 ? 'E' : 'W'}`;
  }
};

// Alternative: Simple coordinate-based address for offline use
export const getCoordinateAddress = (lat, lng) => {
  // Simple coordinate-based naming
  const direction = lat >= 0 ? 'N' : 'S';
  const direction2 = lng >= 0 ? 'E' : 'W';
  
  return `${Math.abs(lat).toFixed(4)}°${direction}, ${Math.abs(lng).toFixed(4)}°${direction2}`;
};