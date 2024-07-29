import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Import AuthContext
import axios from 'axios';

// Set default credentials to true
axios.defaults.withCredentials = true;

// Configure base URL 
axios.defaults.baseURL = 'https://groozify-server.vercel.app';

// Public Pages
import HomePage from './pages/userPages/HomePage';
import LoginPage from './pages/authPages/LoginPage';
import SignupPage from './pages/authPages/SignupPage';

// Private Pages
import HistoryPage from './pages/userPages/HistoryPage';
import ListPage from './pages/userPages/ListPage';
import EditList from './pages/userPages/EditList';

const PrivateRoute = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Display a loading indicator

  return isAuthenticated ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Private Routes */}
        <Route path="/history" element={<PrivateRoute element={<HistoryPage />} />} />
        <Route path="/list" element={<PrivateRoute element={<ListPage />} />} />
        <Route path="/edit/:id" element={<PrivateRoute element={<EditList />} />} /> {/* Updated to handle dynamic parameter */}

        {/* Redirects */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

const AppWrapper = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWrapper;
