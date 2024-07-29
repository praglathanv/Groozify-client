import React, { useState } from 'react';
import { IoMdHome, IoMdListBox } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ConfirmationModal from '../popUp/Model'; 

const NavBar = () => {
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login'; 
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className='w-full bg-white pb-2'>
      <nav className=''>
        <ul className='flex justify-around items-center text-3xl py-2'>
          <Link to='/'><li><IoMdHome /></li></Link>
          <Link to='/list'><li><IoIosAddCircleOutline /></li></Link>
          <Link to='/history'><li><IoMdListBox/></li></Link>
          <li onClick={() => setIsModalOpen(true)}><IoLogOut /></li>
        </ul>
      </nav>

      {/* Render the Confirmation Modal */}
      <ConfirmationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleLogout} 
      />
    </div>
  );
};

export default NavBar;
