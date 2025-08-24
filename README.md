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
- **Nginx** - High-performance web server and reverse proxy for static files and API routing
- **MongoDB Atlas** - Managed cloud database service for production data storage
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

## 🔄 CI/CD Process

The workflow is defined in `.github/workflows/ci.yml`. It runs on **every push or pull request** to the **`main`** branch.

### Steps:
1. **Checkout & Setup**
  - Pulls the repo code
  - Installs Node.js (latest version)

2. **Install Dependencies**
  - Installs root, backend, and frontend dependencies

3. **Run Tests**
  - Spins up a MongoDB service in the workflow
  - Runs backend unit tests
  - Stores test results as artifacts for later inspection

4. **Build**
  - Builds backend (compiled code)
  - Builds frontend (`dist/` bundle with Vite)

5. **Deploy to EC2**
  - Copies frontend build artifacts (`dist/`) to `/home/ec2-user/app`
  - Copies backend files to `/home/ec2-user/app/Backend`
  - Installs backend production dependencies
  - Restarts backend using **PM2** (process manager)

6. **Post-Deployment Log Analysis**
  - Downloads and prints test logs

## Infrastructure Choices

### Why EC2?
We use **AWS EC2** because:
- **Full control over server environment** (unlike serverless or managed services)
- **Scalable** → can increase instance size if traffic grows
- **Cost-effective** for small-to-medium apps (pay-as-you-go)
- **Flexible deployment** (Node.js backend + static frontend + MongoDB client)
- **Compatible with PM2 & Nginx** for production-grade process management and reverse proxying

### Why MongoDB Atlas?
We use **MongoDB Atlas** for our production database because:
- **Fully managed** → no database server maintenance required
- **Built-in security** → encryption at rest and in transit
- **Automatic backups** → point-in-time recovery and scheduled backups
- **Global clusters** → can replicate data across multiple regions
- **Performance monitoring** → built-in metrics and alerting
- **Scalable** → can upgrade cluster size as data grows
- **Free tier available** → cost-effective for development and small applications

### Why PM2?
We use **PM2** for process management because:
- **Auto-restart** → automatically restarts the app if it crashes
- **Zero-downtime deployments** → restart without dropping connections
- **Process monitoring** → CPU/memory usage tracking and logging
- **Cluster mode** → can spawn multiple Node.js processes for load balancing
- **Built-in log management** → centralized logging with rotation
- **Production-ready** → battle-tested in enterprise environments

### Why Nginx?
We use **Nginx** as our web server because:
- **High performance** → efficiently serves static files (React build)
- **Reverse proxy** → routes API requests to Node.js backend
- **SSL termination** → handles HTTPS certificates and encryption
- **Load balancing** → can distribute traffic across multiple backend instances
- **Security features** → protection against common web attacks
- **Caching** → improves performance by caching static assets

