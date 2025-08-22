const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose"); 

// for in-memory DB and wont effect the local db
const { MongoMemoryServer } = require("mongodb-memory-server"); 


// Mock the JWT middleware to bypass authentication
jest.mock("../middleware/auth_middleware", () => {
    const mongoose = require("mongoose");
    // Create a fixed ObjectId inside the factory
    const fixedUserId = new mongoose.Types.ObjectId();

    return (req, res, next) => {
        // use fixed userId
        req.user = { userId: fixedUserId };
        next();
    }
});

const parkingNotesRouter = require("../routes/parking_routes");
const ParkingNote = require("../models/parkingnote");

const app = express();
app.use(express.json());
app.use("/api/parking", parkingNotesRouter);

let mongoServer;

// Setup in-memory MongoDB before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Cleanup DB between tests
afterEach(async () => {
  await ParkingNote.deleteMany({});
});

// Close DB and stop server after all tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Parking Notes API", () => {
  test("POST /api/parking should create a note", async () => {
    const response = await request(app)
      .post("/api/parking")
      .send({
        address: "123 Test Street",
        coordinates: { lat: -37.8, lng: 144.9 },
        expiryTime: new Date().toISOString(),
        notes: "Test note",
      });

    expect(response.status).toBe(201);
    expect(response.body.address).toBe("123 Test Street");
    expect(response.body.notes).toBe("Test note");
  });

  test("GET /api/parking should return empty array initially", async () => {
    const response = await request(app).get("/api/parking");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  test("GET /api/parking should return the created note", async () => {
    // create a note
    await request(app).post("/api/parking").send({
      address: "456 Another Street",
      coordinates: { lat: -37.9, lng: 145.0 },
      expiryTime: new Date().toISOString(),
      notes: "Another note",
    });

    // fetch all notes
    const response = await request(app).get("/api/parking");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].address).toBe("456 Another Street");
  });
});