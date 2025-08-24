# 🚗 Parkify - Smart Parking Management System

**Deployed Application: http://13.238.217.17/login**

This is a full-stack MERN application that helps users manage their parking spots with real-time tracking, expiration alerts, and interactive maps. The application allows users to securely create, update, and delete parking notes with GPS coordinates and time-based notifications.

## Features

- **Authentication with JWT** - Secure user registration and login system
- **Parking spot management** - Create, update, delete, and view parking notes
- **Real-time location tracking** - GPS coordinates capture and address lookup
- **Interactive maps** - View all parking locations with Leaflet integration
- **Expiration alerts** - Visual warnings with color-coded status indicators
- **Time calculations** - Real-time countdown timers for parking sessions
- **Responsive design** - Works seamlessly on desktop and mobile devices
- **Protected routes** - Secure API endpoints with user authorization
- **Input validation** - Frontend and backend validation with error handling

## Getting Started

Follow these steps to get the application running locally:

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/parkify.git
cd parkify
```

### 2. Backend Setup
```bash
cd Backend
npm install
```

### 3. Create Environment Files

**Backend `.env` file:**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/parkify
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

**Frontend `.env` file:**
```bash
cd ../Frontend
npm install
```
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Start MongoDB (if not already running)
```bash
mongod
```

### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

You should see output confirming the server connections:
```
Backend: Server running on http://localhost:5000
Frontend: Local server running on http://localhost:5173
```

## Live Application

The application is currently deployed and accessible at:
**http://13.238.217.17/login**

### Usage Instructions:
1. Create a new account or login with existing credentials
2. Add parking notes by filling in address, GPS location, and expiry time
3. View all your parking notes with real-time status updates
4. Use the interactive map to see all parking locations
5. Receive visual alerts when parking is about to expire

## API Endpoints

### Authentication
- `POST /api/auth/register` → Register a new user
- `POST /api/auth/login` → Login existing user

Once authenticated, users can perform:

### Parking Notes | CRUD Operations
- `POST /api/parking` → Create a new parking note
- `GET /api/parking` → Get all user's parking notes
- `GET /api/parking/:id` → Get one specific parking note
- `PATCH /api/parking/:id` → Update parking note details
- `DELETE /api/parking/:id` → Delete one specific parking note

## Technology Stack

### Frontend
- **React 18** - Component-based UI development with modern hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Leaflet Maps** - Interactive mapping with custom markers
- **Axios** - HTTP client for API communication

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework for routing and middleware
- **MongoDB** - NoSQL database for flexible document storage
- **Mongoose** - Object Data Modeling (ODM) library for MongoDB
- **JSON Web Token (JWT)** - Secure authentication and authorization
- **bcrypt** - Password hashing for security

### Deployment
- **AWS EC2** - Cloud hosting platform
- **PM2** - Process manager for Node.js applications
- **GitHub Actions** - CI/CD automation pipeline

## Dependent Software and Packages

### Core Dependencies

**Mongoose**  
Object Data Modelling (ODM) library connecting MongoDB with Node.js, enabling JavaScript object interaction with the database.

**Express.js**  
Backend framework facilitating HTTP routing and middleware functions for the request-response cycle.

**JSON Web Token**  
Secure method for creating, verifying, and decoding information between parties, ensuring protected routes.

**bcrypt**  
Password-hashing function that creates secure, one-way hash passwords for user authentication.

**React**  
Component-based JavaScript library for building interactive user interfaces with efficient state management.

**Leaflet**  
Open-source JavaScript library for mobile-friendly interactive maps with custom marker support.

## Minimal Hardware Requirements

For local development and testing:

- **CPU**: Dual-core processor (Intel i3 or equivalent)
- **RAM**: 4 GB (for local MongoDB) or 2 GB (with cloud database)
- **Storage**: 10 GB for MongoDB, logs, and application files
- **OS**: Windows 10+, macOS, or Linux
- **Browser**: Modern browser with geolocation support

## Comparisons to Alternative Technologies

| Stack | Frontend | Backend | Database | Pros | Cons | Best For |
|-------|----------|---------|----------|------|------|----------|
| **MERN (Current)** | React | Express.js + Node.js | MongoDB | Flexible schema, JavaScript everywhere, large ecosystem | Learning curve, NoSQL limitations | Modern web apps with real-time features |
| **MEAN** | Angular | Express.js + Node.js | MongoDB | TypeScript support, enterprise features | Steeper learning curve, complex setup | Large-scale enterprise applications |
| **Django + React** | React | Django (Python) | PostgreSQL | Built-in admin, robust ORM | Two languages required, slower development | Data-heavy applications with admin needs |
| **Next.js + Prisma** | Next.js | Node.js | PostgreSQL | SEO-friendly, type-safe database queries | Complex for simple apps, SSR overhead | Full-stack apps requiring SEO |
| **Vue + Laravel** | Vue.js | Laravel (PHP) | MySQL | Rapid development, elegant syntax | Mixed language stack, PHP hosting | Content management systems |

## Licenses of Technologies Used

- **MongoDB** - Server Side Public License (SSPL)
- **Express.js** - MIT License
- **React** - MIT License  
- **Node.js** - MIT License
- **Mongoose** - MIT License
- **JSON Web Token** - MIT License
- **bcrypt** - MIT License
- **Leaflet** - BSD 2-Clause License
- **Vite** - MIT License
- **Tailwind CSS** - MIT License
