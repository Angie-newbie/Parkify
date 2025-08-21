import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {authAPI} from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();

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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
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
        const{user} = await authAPI.register(formData);
        console.log('Registerd')

        navigate('/parking')
        } catch (error) {
            setGeneralError('An error occurred during registration. Please try again.');
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
        <h2>Create Account</h2>
        
        {generalError && (
          <div className="message error" style={{ marginBottom: '1.5rem' }}>
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              disabled={isLoading}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <span className="error-text">{errors.name}</span>
            )}
          </div>

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
              placeholder="Create a strong password"
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
            <small style={{ 
              color: '#6b7280', 
              fontSize: '0.875rem', 
              marginTop: '0.25rem', 
              display: 'block' 
            }}>
              Must be at least 8 characters with uppercase, lowercase, and number
            </small>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
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
            Already have an account?
          </p>
          <button 
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/login')}
            disabled={isLoading}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;