const express = require('express');
const ParkingNote = require('../models/parkingnote');
const authenticateToken = require('../middleware/auth_middleware');

const router = express.Router();


// Get all parking notes for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Find parking notes, only select necessary fields
    const notes = await ParkingNote.find(
      { userId: req.user.userId },           // only notes for this user
      '_id address notes expiryTime'         // only these fields
    ).sort({ createdAt: -1 });               // newest first

    res.json(notes);
  } catch (error) {
    console.error('Error fetching parking notes:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get one parking note by ID
router.get('/:id', authenticateToken, async (req, res) => {
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
router.post('/', authenticateToken, async (req, res) => {
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
router.put('/:id', authenticateToken, async (req, res) => {
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
router.delete('/:id', authenticateToken, async (req, res) => {
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