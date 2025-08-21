// main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import './styles.css' 
import App from './App.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Parking from './components/ParkingDashboard.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login page */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Layout wrapper */}
        <Route element={<App />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Parking dashboard */}
          <Route path="/parking" element={<Parking />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
