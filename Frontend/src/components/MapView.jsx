import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = ({ notes = [], selectedNote = null }) => {
  const [mapError, setMapError] = useState('');

  // Force map re-render
  const [mapKey, setMapKey] = useState(0);

  // Filter notes that have coordinates
  const notesWithCoordinates = notes.filter(note => 
    note.coordinates && note.coordinates.lat && note.coordinates.lng &&
    !isNaN(note.coordinates.lat) &&
    !isNaN(note.coordinates.lng)
  );

  // Determine map center - prioritize selected note, then first note, then Melbourne
  const getMapCenter = () => {
    if (selectedNote && selectedNote.coordinates) {
      return selectedNote.coordinates;
    }
    
    if (notesWithCoordinates.length > 0) {
      return notesWithCoordinates[0].coordinates;
    }
    
    // Default to Melbourne, Australia (your location based on the error coordinates)
    return { lat: -37.8136, lng: 144.9631 };
  };

  const mapCenter = getMapCenter();

  // Force map update when notes change
  useEffect(() => {
    setMapKey(prev => prev + 1);
  }, [notes.length, selectedNote]);

  // Get status-based marker colors
  const getMarkerIcon = (note) => {
    const expiryTime = new Date(note.expiryTime);
    const now = new Date();
    const timeDiff = expiryTime - now;
    const hoursLeft = timeDiff / (1000 * 60 * 60);

    let color = '#10b981'; // active - green
    if (hoursLeft <= 0) {
      color = '#ef4444'; // expired - red
    } else if (hoursLeft <= 1) {
      color = '#f59e0b'; // warning - yellow
    }

    return new L.Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      `)}`,
      iconSize: [25, 25],
      iconAnchor: [12, 25],
      popupAnchor: [0, -25]
    });
  };

  const formatTimeRemaining = (expiryTime) => {
    const now = new Date();
    const expiry = new Date(expiryTime);
    const timeDiff = expiry - now;
    
    if (timeDiff <= 0) {
      return 'EXPIRED';
    }
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    } else {
      return `${minutes}m left`;
    }
  };

  if (mapError) {
    return (
      <div className="map-view">
        <div className="map-error">
          <p>Map could not be loaded</p>
          <p>{mapError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-view">
      <div className="map-header">
        <h3>📍 Parking Locations Map</h3>
        <p>{notesWithCoordinates.length} parking location{notesWithCoordinates.length !== 1 ? 's' : ''} found</p>
      </div>

      {notesWithCoordinates.length === 0 ? (
        <div className="no-locations">
          <p>No parking locations to display on map.</p>
          <p>Add a parking note with location to see it here!</p>
        </div>
      ) : (
        <div style={{ height: '400px', borderRadius: '8px', overflow: 'hidden' }}>
          <MapContainer
            key={mapKey}
            center={[mapCenter.lat, mapCenter.lng]}
            zoom={14}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {notesWithCoordinates.map((note) => (
              <Marker
                key={note._id}
                position={[note.coordinates.lat, note.coordinates.lng]}
                icon={getMarkerIcon(note)}
              >
                <Popup>
                  <div style={{ minWidth: '200px' }}>
                    <strong style={{ fontSize: '14px' }}>
                      {note.address || "Parking Spot"}
                    </strong>
                    
                    {note.notes && (
                      <p style={{ margin: '8px 0', fontSize: '12px', color: '#666' }}>
                        📝 {note.notes}
                      </p>
                    )}
                    
                    <p style={{ margin: '8px 0', fontSize: '12px' }}>
                      ⏰ Expires: {new Date(note.expiryTime).toLocaleString()}
                    </p>
                    
                    <p style={{ 
                      margin: '4px 0 0 0', 
                      fontSize: '12px', 
                      fontWeight: 'bold',
                      color: new Date(note.expiryTime) <= new Date() ? '#ef4444' : '#059669'
                    }}>
                      {formatTimeRemaining(note.expiryTime)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
      
      <div className="map-footer">
        <p>💡 Tips:</p>
        <ul>
          <li>🟢 Green markers: Active parking</li>
          <li>🟡 Yellow markers: Expiring soon (≤1 hour)</li>
          <li>🔴 Red markers: Expired parking</li>
          <li>Click markers for details</li>
        </ul>
      </div>
    </div>
  );
};

export default MapView;