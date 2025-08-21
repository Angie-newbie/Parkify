import { useState, useEffect } from 'react';
import { parkingAPI, getCurrentLocation } from '../services/api';

const ParkingForm = ({ editingNote, onSuccess, onCancel }) => {
  // Form state
  const [formData, setFormData] = useState({
    address: '',
    coordinates: null,
    expiryTime: '',
    notes: '',
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (editingNote) {
      // Format the expiry time for datetime-local input
      const expiryDate = new Date(editingNote.expiryTime);
      const localDateTime = new Date(expiryDate.getTime() - (expiryDate.getTimezoneOffset() * 60000))
        .toISOString()
        .slice(0, 16);

      setFormData({
        address: editingNote.address || '',
        coordinates: editingNote.coordinates || null,
        expiryTime: localDateTime,
        notes: editingNote.notes || '',
      });
    } else {
      // Reset form for new note
      setFormData({
        address: '',
        coordinates: null,
        expiryTime: '',
        notes: '',
      });
    }
  }, [editingNote]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Get user's current location
  const handleGetLocation = async () => {
    setLocationLoading(true);
    setMessage('');
    
    try {
      const location = await getCurrentLocation();
      setFormData(prev => ({
        ...prev,
        coordinates: location,
      }));
      setMessage('Location captured successfully!');
    } catch (error) {
      setMessage(`Location error: ${error.message}`);
    } finally {
      setLocationLoading(false);
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 5) {
      newErrors.address = 'Address must be at least 5 characters';
    }

    // Expiry time validation
    if (!formData.expiryTime) {
      newErrors.expiryTime = 'Expiry time is required';
    } else {
      const expiryDate = new Date(formData.expiryTime);
      const now = new Date();
      
      if (expiryDate <= now) {
        newErrors.expiryTime = 'Expiry time must be in the future';
      }
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      let result;
      
      if (editingNote) {
        // Update existing note
        result = await parkingAPI.updateNote(editingNote._id, formData);
        setMessage('Parking note updated successfully!');
      } else {
        // Create new note
        result = await parkingAPI.createNote(formData);
        setMessage('Parking note created successfully!');
      }

      // Reset form if creating new note
      if (!editingNote) {
        setFormData({
          address: '',
          coordinates: null,
          expiryTime: '',
          notes: '',
        });
      }

      // Call success callback
      if (onSuccess) {
        onSuccess(result);
      }
      
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    // Reset form
    setFormData({
      address: '',
      coordinates: null,
      expiryTime: '',
      notes: '',
    });
    setErrors({});
    setMessage('');
    
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="parking-form">
      <h2>{editingNote ? 'Edit Parking Note' : 'Add New Parking Note'}</h2>
      
      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Address Input */}
        <div className="form-group">
          <label htmlFor="address">Address *</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter parking address"
            className={errors.address ? 'error' : ''}
          />
          {errors.address && <span className="error-text">{errors.address}</span>}
        </div>

        {/* Location Section */}
        <div className="form-group">
          <label>Current Location</label>
          <div className="location-controls">
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locationLoading}
              className="location-btn"
            >
              {locationLoading ? 'Getting Location...' : '📍 Use My Location'}
            </button>
            
            {formData.coordinates && (
              <div className="coordinates-display">
                <small>
                  📍 Lat: {formData.coordinates.lat.toFixed(6)}, 
                  Lng: {formData.coordinates.lng.toFixed(6)}
                </small>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, coordinates: null }))}
                  className="clear-location"
                >
                  ❌
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Expiry Time Input */}
        <div className="form-group">
          <label htmlFor="expiryTime">Parking Expires *</label>
          <input
            type="datetime-local"
            id="expiryTime"
            name="expiryTime"
            value={formData.expiryTime}
            onChange={handleInputChange}
            className={errors.expiryTime ? 'error' : ''}
          />
          {errors.expiryTime && <span className="error-text">{errors.expiryTime}</span>}
        </div>

        {/* Notes Input */}
        <div className="form-group">
          <label htmlFor="notes">Notes (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Additional notes (e.g., Level 2, Spot A5)"
            rows="3"
          />
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Saving...' : (editingNote ? 'Update Note' : 'Add Note')}
          </button>
          
          {(editingNote || onCancel) && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ParkingForm;