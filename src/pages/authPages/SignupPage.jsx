import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../components/popUp/Loader'; 

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // State to manage loading
  const navigate = useNavigate();

  // Handle Signup and OTP Sending
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when signup starts
    setMessage(''); // Clear previous messages

    try {
      // Call the signup API
      const signupResponse = await axios.post('/auth/signup', { email });
      if (signupResponse.status === 201) {
        // Call the verifyEmail API to send OTP
        const otpResponse = await axios.post('/auth/verify-email', { email });
        if (otpResponse.status === 200) {
          setOtpSent(true); // Show OTP input field
          setMessage('Verification email sent. Please check your inbox for the OTP.');
        } else {
          setMessage(otpResponse.data.error);
        }
      } else {
        setMessage(signupResponse.data.error);
      }
    } catch (error) {
      setMessage('Error during signup. Please try again.');
    } finally {
      setLoading(false); // Set loading to false after the signup attempt
    }
  };

  // Handle OTP Verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when verifying OTP
    setMessage(''); // Clear previous messages

    try {
      // Call the checkVerification API
      const verifyOtpResponse = await axios.post('/auth/check-verification', { email, token: otp });
      if (verifyOtpResponse.status === 200) {
        setMessage('Email verified successfully! You can now log in.');
        navigate('/login'); // Redirect to login page after successful verification
      } else {
        setMessage(verifyOtpResponse.data.error);
      }
    } catch (error) {
      setMessage('Error verifying OTP. Please try again.');
    } finally {
      setLoading(false); // Set loading to false after the OTP verification attempt
    }
  };

  return (
    <div className='flex justify-center items-center h-[100vh]'>
      {loading ? (
        <Loader /> // Show loader if loading is true
      ) : (
        <form onSubmit={otpSent ? handleVerifyOtp : handleSignup} className='flex flex-col gap-y-20 py-20 px-16 border rounded-lg border-black relative'>
          <h1 className='font-bold text-xl absolute top-0 left-[40%]'>Signup</h1>
          <input 
            type="email" // Change type to email
            placeholder='Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='outline-none border-b border-black'
            disabled={otpSent} // Disable email input if OTP is being verified
          />

          {otpSent && (
            <input
              type="text"
              placeholder='Enter OTP'
              value={otp}
              onChange={e => setOtp(e.target.value)}
              className='outline-none border-b border-black'
            />
          )}

          <button type='submit' className='border border-blue-500 bg-blue-500 text-white px-1 py-1 rounded-lg cursor-pointer'>
            {otpSent ? 'Verify OTP' : 'Signup'}
          </button>

          <p className='mt-[-4.2rem]'>Already have an account? <Link to='/login' className='text-blue-800 cursor-pointer'>Login</Link></p>

          {message && <p className='text-red-500'>{message}</p>}
        </form>
      )}
    </div>
  );
};

export default SignupPage;
