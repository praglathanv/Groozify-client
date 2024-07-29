import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../components/popUp/Loader'; 

const LoginPage = () => {
  const [email, setEmail] = useState(''); // Change phoneNumber state to email
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // State to manage loading
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate(); // Use useNavigate for redirecting

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Set loading to true when login starts
    setMessage(''); // Clear previous messages

    try {
      await login(email); // Use email for login
      // If the user is authenticated, navigate to the list page
      navigate('/list'); // Redirect to private route
    } catch (error) {
      console.error('Login failed:', error);
      setMessage(error.message || 'Login failed. Please try again.'); // Display specific error message
    } finally {
      setLoading(false); // Set loading to false after the login attempt
    }
  };

  return (
    <div className='flex justify-center items-center h-[100vh]'>
      {loading ? (
        <Loader /> // Show loader if loading is true
      ) : (
        <form onSubmit={handleLogin} className='flex flex-col gap-y-20 py-20 px-16 border rounded-lg border-black relative'>
          <h1 className='font-bold text-xl absolute top-0 left-[40%]'>Login</h1>
          <input 
            type="email" // Change input type to email
            placeholder='Email'
            value={email} // Bind input value to email state
            onChange={e => setEmail(e.target.value)} // Update state on change
            className='outline-none border-b border-black'
            required // Make email input required
          />
          <button type='submit' className='border border-blue-500 bg-blue-500 text-white px-1 py-1 rounded-lg cursor-pointer'>
            Login
          </button>
          <p className='mt-[-4.2rem]'>
            Don't have an account? <Link to='/signup' className='text-blue-800 cursor-pointer'>Signup</Link>
          </p>
          {message && <p className='text-red-500'>{message}</p>} 
        </form>
      )}
    </div>
  );
};

export default LoginPage;
