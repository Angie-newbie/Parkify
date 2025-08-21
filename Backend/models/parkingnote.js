const mongoose = require('mongoose');

// ParkingNote Schema
const parkingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, required: true },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  expiryTime: { type: Date, required: true },
  notes: { type: String, default: '' },
  reminderSent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Parking', parkingSchema);