import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoDotFill } from 'react-icons/go';
import { useAuth } from './AuthProvider'; // Adjust the import based on your file structure

const RecentList = () => {
  const { isAuthenticated, loading: authLoading } = useAuth(); // Get authentication state
  const [recentList, setRecentList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleGetRecentList = async (token) => {
    try {
      const response = await axios.get('/user/grocery-lists', {
        headers: {
          'Authorization': `Bearer ${token}` // Use the token for authentication
        }
      });

      if (response.status === 200) {
        const lists = response.data.lists;
        if (lists.length > 0) {
          // Get the most recent list 
          setRecentList(lists[lists.length - 1]);
        } else {
          setError('No grocery lists found.');
        }
      }
    } catch (err) {
      console.error('Error fetching grocery lists:', err);
      setError('Failed to fetch grocery lists.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const token = Cookies.get('token'); // Get the token from cookies
      console.log('Token:', token); // Log the token to the console
      handleGetRecentList(token); // Call the function with the token
    } else {
      setError('User is not authenticated. Please log in.');
      setLoading(false); // Set loading to false if user is not authenticated
    }
  }, [isAuthenticated]); // Run when isAuthenticated changes

  if (loading || authLoading) { // Wait for both loading states
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      {recentList ? (
        <div className='p-3'>
          <h2 className='text-2xl font-semibold'>{recentList.name}</h2>
          <ul className='mt-4 w-[75%] lg:w-[50%]'>
            {recentList.groceries.map(grocery => (
              <li key={grocery._id} className='border border-black rounded mt-2 p-2 flex'>
                <span className='flex-1'>{grocery.item}</span> 
                <span className='flex-1'>-</span>
                <span className='flex-1'>{grocery.quantity}</span>
                <span><GoDotFill className='mt-1'/></span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>No recent grocery list available.</div>
      )}
    </div>
  );
};

export default RecentList;
