import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/auth/check-auth', {
          withCredentials: true, // Ensure cookies are sent with the request
        });

        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Authentication check failed:', error.response?.data || error.message);
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // Set loading to false once the check is complete
      }
    };

    checkAuth();
  }, []); // Run once on mount

  // Call checkAuth whenever isAuthenticated changes
  useEffect(() => {
    const recheckAuth = async () => {
      if (!loading) {
        try {
          await checkAuth(); // Call the function whenever isAuthenticated changes
        } catch (error) {
          console.error('Error during rechecking authentication:', error);
        }
      }
    };

    recheckAuth(); // Invoke the function

  }, [isAuthenticated]); // Run when isAuthenticated changes

  const login = async (email) => {
    try {
      await axios.post('/auth/login', { email }, { withCredentials: true });
      setIsAuthenticated(true); // Assume successful login sets authentication
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      setIsAuthenticated(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true });
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
