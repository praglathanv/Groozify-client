import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('groozifyToken');
    setIsAuthenticated(!!token); // Set to true if token exists
    setLoading(false);
  };

  // Check authentication status on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email) => {
    try {
      const response = await axios.post('/auth/login', { email });

      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem('groozifyToken', token);
        setIsAuthenticated(true);
        console.log('Login successful:', response.data);
      } else {
        setIsAuthenticated(false);
        console.error('Unexpected response login failed:', response.data);
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      setIsAuthenticated(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error.response?.data || error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {!loading && children} {/* Render children only when loading is complete */}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
