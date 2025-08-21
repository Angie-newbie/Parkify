const express = require('express');
const Parking = require('../models/parkingnote');
const authenticateToken = require('../middleware/auth_middleware');

const router = express.Router();


// Get all parking notes for user
router.get('/api/parking-notes', authenticateToken, async (req, res) => {
  try {
    const notes = await ParkingNote.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get one parking note by ID
router.get('/api/parking-notes/:id', authenticateToken, async (req, res) => {
  try {
    const note = await ParkingNote.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!note) {
      return res.status(404).json({ message: 'Parking note not found' });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new parking note
router.post('/api/parking-notes', authenticateToken, async (req, res) => {
  try {
    const { address, coordinates, expiryTime, notes } = req.body;

    const parkingNote = new ParkingNote({
      userId: req.user.userId,
      address,
      coordinates,
      expiryTime: new Date(expiryTime),
      notes
    });

    await parkingNote.save();
    res.status(201).json(parkingNote);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update parking note
router.put('/api/parking-notes/:id', authenticateToken, async (req, res) => {
  try {
    const { address, coordinates, expiryTime, notes } = req.body;

    const parkingNote = await ParkingNote.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { address, coordinates, expiryTime: new Date(expiryTime), notes },
      { new: true }
    );

    if (!parkingNote) {
      return res.status(404).json({ message: 'Parking note not found' });
    }

    res.json(parkingNote);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete parking note
router.delete('/api/parking-notes/:id', authenticateToken, async (req, res) => {
  try {
    const parkingNote = await ParkingNote.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!parkingNote) {
      return res.status(404).json({ message: 'Parking note not found' });
    }

    res.json({ message: 'Parking note deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;