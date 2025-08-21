import axios from 'axios';

// Use environment variable for base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
// Adds token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Response interceptor
// Handles errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      console.error('Unauthorized access - token removed');
    }
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);


// Parking Notes API
export const parkingAPI = {
  getAllNotes: async () => {
    try {
      const response = await api.get('/parking');
      return response.data;
    } catch (error) {
      console.error('Error fetching parking notes:', error.message);
      throw error;
    }
  },

  getNoteById: async (id) => {
    try {
      const response = await api.get(`/parking/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching parking note:', error.message);
      throw error;
    }
  },

  createNote: async (noteData) => {
    try {
      const response = await api.post('/parking', noteData);
      return response.data;
    } catch (error) {
      console.error('Error creating parking note:', error.message);
      throw error;
    }
  },

  updateNote: async (id, noteData) => {
    try {
      const response = await api.put(`/parking/${id}`, noteData);
      return response.data;
    } catch (error) {
      console.error('Error updating parking note:', error.message);
      throw error;
    }
  },

  deleteNote: async (id) => {
    try {
      const response = await api.delete(`/parking/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting parking note:', error.message);
      throw error;
    }
  },
};


// Authentication API
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem('token', token);
      }
      return { token, user };
    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem('token', token);
      }
      return { token, user };
    } catch (error) {
      console.error('Registration error:', error.message);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Geolocation helper
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        let message = 'Unable to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out';
            break;
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
};

export default api;
