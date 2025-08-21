const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/user'); 
const ParkingNote = require('./models/parkingnote');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear existing data
    await User.deleteMany();
    await ParkingNote.deleteMany();

    // Create some test users
    const users = await User.create([
      {
        email: 'user@gmail.com',
        password: await bcrypt.hash('12345', 10),
        name: 'Test User'
      },
      {
        email: 'admin@gmail.com',
        password: await bcrypt.hash('admin123', 10),
        name: 'Admin User'
      }
    ]);

    // Create some test parking notes for first user
    const parkingNotes = await ParkingNote.create([
      {
        userId: users[0]._id,
        address: '123 Main St, Sydney',
        coordinates: { lat: -33.8688, lng: 151.2093 },
        expiryTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
        notes: 'Near the cafe'
      },
      {
        userId: users[0]._id,
        address: '456 Park Lane, Melbourne',
        coordinates: { lat: -37.8136, lng: 144.9631 },
        expiryTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        notes: 'Next to the office'
      }
    ]);

    console.log('Seeded users:', users);
    console.log('Seeded parking notes:', parkingNotes);

  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    mongoose.disconnect();
  }
}

seed();
