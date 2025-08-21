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

  console.log("🗺️ MapView received notes:", notes);
  console.log("🗺️ Notes length:", notes.length);
  
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
    let status = 'Active';
    
    if (hoursLeft <= 0) {
      color = '#ef4444'; // expired - red
      status = 'Expired';
    } else if (hoursLeft <= 1) {
      color = '#f59e0b'; // warning - amber
      status = 'Expiring Soon';
    }

    console.log(`🎨 Creating marker for ${note.address}: ${status} (${color})`);

    // Create a more reliable SVG icon
    const svgIcon = `
      <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 0C6.7 0 0 6.7 0 15c0 11.25 15 25 15 25s15-13.75 15-25C30 6.7 23.3 0 15 0z" 
              fill="${color}" stroke="#fff" stroke-width="2"/>
        <circle cx="15" cy="15" r="6" fill="#fff"/>
        <text x="15" y="19" text-anchor="middle" fill="${color}" font-family="Arial" font-size="12" font-weight="bold">P</text>
      </svg>
    `;

    return new L.Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
      iconSize: [30, 40],
      iconAnchor: [15, 40],
      popupAnchor: [0, -40],
      className: `parking-marker parking-marker-${status.toLowerCase().replace(' ', '-')}`
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

  const getStatusColor = (expiryTime) => {
    const now = new Date();
    const expiry = new Date(expiryTime);
    const timeDiff = expiry - now;
    const hoursLeft = timeDiff / (1000 * 60 * 60);

    if (hoursLeft <= 0) return '#ef4444'; // red
    if (hoursLeft <= 1) return '#f59e0b';  // amber
    return '#10b981'; // green
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
    console.log("Notes received by MapView:", notes);
    console.log("Notes with coordinates:", notesWithCoordinates);
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
            
            {notesWithCoordinates.map((note) => {
              const customIcon = getMarkerIcon(note);
              console.log(`🗺️ Rendering marker for ${note.address} with icon:`, customIcon);
              
              return (
                <Marker
                  key={note._id}
                  position={[note.coordinates.lat, note.coordinates.lng]}
                  icon={customIcon}
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
                        color: getStatusColor(note.expiryTime)
                      }}>
                        {formatTimeRemaining(note.expiryTime)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      )}
      
      <div className="map-footer">
        <p>💡 Legend:</p>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: '#10b981', 
              borderRadius: '50%' 
            }}></div>
            <span style={{ fontSize: '12px' }}>Active parking</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: '#f59e0b', 
              borderRadius: '50%' 
            }}></div>
            <span style={{ fontSize: '12px' }}>Expiring soon (≤1h)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: '#ef4444', 
              borderRadius: '50%' 
            }}></div>
            <span style={{ fontSize: '12px' }}>Expired</span>
          </div>
        </div>
      </div>
    </div>
  );
};


export default MapView;