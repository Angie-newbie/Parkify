import { useState, useEffect } from 'react';

const MapView = ({ notes = [], selectedNote = null }) => {
  const [mapError, setMapError] = useState('');

  // Filter notes that have coordinates
  const notesWithCoordinates = notes.filter(note => 
    note.coordinates && note.coordinates.lat && note.coordinates.lng
  );

  // Calculate center point for map
  const getMapCenter = () => {
    if (notesWithCoordinates.length === 0) {
      // Default to a central location (you can change this)
      return { lat: 37.7749, lng: -122.4194 }; // San Francisco
    }

    if (selectedNote && selectedNote.coordinates) {
      return selectedNote.coordinates;
    }

    // Calculate average position of all notes
    const avgLat = notesWithCoordinates.reduce((sum, note) => sum + note.coordinates.lat, 0) / notesWithCoordinates.length;
    const avgLng = notesWithCoordinates.reduce((sum, note) => sum + note.coordinates.lng, 0) / notesWithCoordinates.length;

    return { lat: avgLat, lng: avgLng };
  };

  // Calculate time remaining for status
  const getTimeStatus = (expiryTime) => {
    const now = new Date();
    const expiry = new Date(expiryTime);
    const diff = expiry - now;

    if (diff <= 0) return 'expired';
    if (diff <= 10 * 60 * 1000) return 'warning'; // Less than 10 minutes
    return 'active';
  };

  const mapCenter = getMapCenter();

  // This is a placeholder implementation
  // In a real app, you would integrate with Google Maps, Mapbox, or Leaflet
  const renderPlaceholderMap = () => (
    <div className="map-placeholder">
      <div className="map-header">
        <h3>🗺️ Parking Locations Map</h3>
        <p>Map integration placeholder - {notesWithCoordinates.length} locations</p>
      </div>
      
      <div className="map-content">
        <div className="map-center-info">
          <p><strong>Map Center:</strong></p>
          <p>📍 {mapCenter.lat.toFixed(6)}, {mapCenter.lng.toFixed(6)}</p>
        </div>

        {notesWithCoordinates.length > 0 && (
          <div className="map-markers">
            <h4>Parking Locations:</h4>
            <div className="markers-list">
              {notesWithCoordinates.map((note, index) => {
                const status = getTimeStatus(note.expiryTime);
                const isSelected = selectedNote && selectedNote._id === note._id;
                
                return (
                  <div 
                    key={note._id} 
                    className={`marker-item ${status} ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="marker-icon">
                      {status === 'expired' ? '🔴' : status === 'warning' ? '🟡' : '🟢'}
                    </div>
                    <div className="marker-info">
                      <div className="marker-address">
                        <strong>{note.address}</strong>
                        {isSelected && <span className="selected-badge">👁️ Selected</span>}
                      </div>
                      <div className="marker-coordinates">
                        📍 {note.coordinates.lat.toFixed(4)}, {note.coordinates.lng.toFixed(4)}
                      </div>
                      <div className="marker-status">
                        Status: <span className={`status-text ${status}`}>
                          {status === 'expired' ? 'Expired' : 
                           status === 'warning' ? 'Expiring Soon' : 'Active'}
                        </span>
                      </div>
                      {note.notes && (
                        <div className="marker-notes">
                          💭 {note.notes}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {notesWithCoordinates.length === 0 && (
          <div className="no-locations">
            <p>No parking locations with coordinates to display.</p>
            <p>Add coordinates to your parking notes to see them on the map!</p>
          </div>
        )}
      </div>

      {/* Instructions for real map integration */}
      <div className="map-footer">
        <small>
          💡 <strong>Integration Note:</strong> This is a placeholder. 
          To add a real map, integrate with:
        </small>
        <ul>
          <li>🗺️ <strong>Google Maps:</strong> react-google-maps/api</li>
          <li>🍃 <strong>Leaflet:</strong> react-leaflet</li>
          <li>📦 <strong>Mapbox:</strong> react-map-gl</li>
        </ul>
      </div>
    </div>
  );

  // For Google Maps integration (commented out example)
  /*
  const renderGoogleMap = () => (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '400px' }}
      center={mapCenter}
      zoom={13}
    >
      {notesWithCoordinates.map((note) => (
        <Marker
          key={note._id}
          position={note.coordinates}
          title={note.address}
          icon={{
            url: getTimeStatus(note.expiryTime) === 'expired' 
              ? 'red-marker.png' 
              : 'green-marker.png',
            scaledSize: new window.google.maps.Size(40, 40),
          }}
        />
      ))}
    </GoogleMap>
  );
  */

  return (
    <div className="map-view">
      {mapError ? (
        <div className="map-error">
          <h3>Map Error</h3>
          <p>{mapError}</p>
          <button onClick={() => setMapError('')} className="btn btn-primary">
            Retry
          </button>
        </div>
      ) : (
        renderPlaceholderMap()
      )}
    </div>
  );
};

export default MapView;