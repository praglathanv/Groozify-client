import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { GoDotFill } from 'react-icons/go';

const RecentList = () => {
  const [recentList, setRecentList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleGetRecentList = async () => {
    try {
      const response = await axios.get('/user/grocery-lists', {
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}` // Include token for authentication
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
    handleGetRecentList(); // Call the function on component mount
  }, []);

  if (loading) {
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
                <span ><GoDotFill className='mt-1'/></span>
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
