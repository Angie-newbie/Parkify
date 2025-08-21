import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {authAPI} from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear general error
    if (generalError) {
      setGeneralError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setGeneralError('');

    try {
        const { user } = await authAPI.login(formData);
        console.log('Logged in user:', user);
        navigate('/parking'); 

    } catch (error) {
      setGeneralError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '0 auto',
      paddingTop: '2rem'
    }}>
      <div className="parking-form">
        <h2>Sign In</h2>
        
        {generalError && (
          <div className="message error" style={{ marginBottom: '1.5rem' }}>
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              disabled={isLoading}
              placeholder="Enter your email"
            />
            {errors.email && (
              <span className="error-text">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              disabled={isLoading}
              placeholder="Enter your password"
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '2rem', 
          paddingTop: '1.5rem', 
          borderTop: '1px solid #e5e7eb' 
        }}>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            Don't have an account?
          </p>
          <button 
            type="button"
            className="btn btn-outline"
            onClick={() => window.location.href = '/register'}
            disabled={isLoading}
          >
            Create Account
          </button>
        </div>

        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          backgroundColor: '#f8fafc', 
          borderRadius: '8px',
          fontSize: '0.9rem',
          color: '#6b7280'
        }}>
        </div>
      </div>
    </div>
  );
};

export default Login;