import React, { useState, useEffect } from 'react';
import { IoMdAdd, IoMdListBox } from 'react-icons/io';
import { Link } from 'react-router-dom';
import RecentList from '../../components/List/RecentList'; 
import { FaHistory } from 'react-icons/fa';
import Loader from '../../components/popUp/Loader'; 

const HomePage = () => {
  const [loading, setLoading] = useState(true); // State to manage loading

  // Simulate loading for recent lists (replace this with your actual data fetching logic)
  useEffect(() => {
    const fetchRecentLists = async () => {
      // Simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false); // End loading after fetching data
    };

    fetchRecentLists();
  }, []);

  return (
    <div className='relative'>
      <div className="flex justify-between mx-2">
        <h1 className='text-2xl font-extrabold'>Groozify</h1>
      </div>

      <img src="/images/shopping_cart.png" className='h-[250px] fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-28%] opacity-30' alt="Shopping Cart" />

      <div className='flex gap-x-3 mx-8 mt-14 lg:w-[30%]'>
        <Link to='/list' className="border border-black rounded-lg flex-1 h-[140px] flex justify-center items-center cursor-pointer hover:bg-blue-100">
          <IoMdAdd className='text-7xl' />
        </Link>
        <Link to='/history' className="border border-black rounded-lg flex-1 h-[140px] flex justify-center items-center cursor-pointer hover:bg-blue-100">
          <IoMdListBox className='text-7xl' />
        </Link>
      </div>

      <div className='hidden md:block mt-20'>
        <div className='flex gap-x-2 p-1 border-b border-gray-500'>
           <h1 className='text-xl ml-1 pb-1'>Recent</h1>
           <FaHistory className='mt-2'/>
        </div>
        
        {loading ? (
          <Loader /> // Show loader if loading is true
        ) : (
          <RecentList /> // Show the RecentList component once loading is complete
        )}
      </div>

    </div>
  );
};

export default HomePage;
