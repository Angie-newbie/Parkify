import { useState, useEffect } from 'react';
import { parkingAPI } from '../services/api';

const ParkingList = ({ onEdit, refreshTrigger }) => {
  // State for parking notes
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch parking notes from API
  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await parkingAPI.getAllNotes();
      setNotes(data || []);
    } catch (err) {
      setError(`Failed to load parking notes: ${err.message}`);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notes on component mount and when refreshTrigger changes
  useEffect(() => {
    fetchNotes();
  }, [refreshTrigger]);

  // Handle delete note
  const handleDelete = async (id) => {
    // Confirm deletion
    if (!window.confirm('Are you sure you want to delete this parking note?')) {
      return;
    }

    try {
      await parkingAPI.deleteNote(id);
      // Remove note from local state
      setNotes(prev => prev.filter(note => note._id !== id));
    } catch (err) {
      alert(`Failed to delete note: ${err.message}`);
    }
  };

  // Calculate time remaining until expiry
  const getTimeRemaining = (expiryTime) => {
    const now = new Date();
    const expiry = new Date(expiryTime);
    const diff = expiry - now;

    if (diff <= 0) {
      return { text: 'EXPIRED', status: 'expired' };
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    // Determine status
    let status = 'active';
    if (diff <= 10 * 60 * 1000) { // Less than 10 minutes
      status = 'warning';
    }

    if (hours > 0) {
      return { text: `${hours}h ${minutes}m`, status };
    } else {
      return { text: `${minutes}m`, status };
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Loading state
  if (loading) {
    return (
      <div className="parking-list">
        <h2>Your Parking Notes</h2>
        <div className="loading">Loading parking notes...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="parking-list">
        <h2>Your Parking Notes</h2>
        <div className="error-message">{error}</div>
        <button onClick={fetchNotes} className="btn btn-primary">
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (notes.length === 0) {
    return (
      <div className="parking-list">
        <h2>Your Parking Notes</h2>
        <div className="empty-state">
          <p>No parking notes yet.</p>
          <p>Add your first parking spot using the form above!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="parking-list">
      <h2>Your Parking Notes ({notes.length})</h2>
      
      <div className="notes-grid">
        {notes.map((note) => {
          const timeRemaining = getTimeRemaining(note.expiryTime);
          
          return (
            <div key={note._id} className={`parking-note ${timeRemaining.status}`}>
              {/* Note Header */}
              <div className="note-header">
                <h3 className="address">📍 {note.address}</h3>
                <div className="actions">
                  <button
                    onClick={() => onEdit(note)}
                    className="btn btn-small btn-outline"
                    title="Edit note"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="btn btn-small btn-danger"
                    title="Delete note"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>

              {/* Coordinates (if available) */}
              {note.coordinates && (
                <div className="coordinates">
                  <small>
                    🌍 {note.coordinates.lat.toFixed(6)}, {note.coordinates.lng.toFixed(6)}
                  </small>
                </div>
              )}

              {/* Notes (if available) */}
              {note.notes && (
                <div className="note-text">
                  <p>{note.notes}</p>
                </div>
              )}

              {/* Time Information */}
              <div className="time-info">
                <div className="expiry-time">
                  <small>🕒 Expires: {formatDate(note.expiryTime)}</small>
                </div>
                <div className={`time-remaining ${timeRemaining.status}`}>
                  <strong>{timeRemaining.text}</strong>
                </div>
              </div>

              {/* Warning for expiring soon */}
              {timeRemaining.status === 'warning' && (
                <div className="warning-banner">
                  ⚠️ Parking expires soon!
                </div>
              )}

              {/* Expired banner */}
              {timeRemaining.status === 'expired' && (
                <div className="expired-banner">
                  🚫 Parking has expired!
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Refresh Button */}
      <div className="list-actions">
        <button onClick={fetchNotes} className="btn btn-outline">
          🔄 Refresh List
        </button>
      </div>
    </div>
  );
};

export default ParkingList;