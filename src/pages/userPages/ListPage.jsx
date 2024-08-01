import React, { useState, useRef } from 'react';
import axios from 'axios';
import { IoMdSave } from 'react-icons/io';
import Nav from '../../components/Nav/NavBar';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; 
import { IoSendSharp } from "react-icons/io5";
import ShareButton from '../../components/Nav/ShareButton'; 
import Loader from '../../components/popUp/Loader'; 

const ListPage = () => {
  const [title, setTitle] = useState('');
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [groceries, setGroceries] = useState([]); 
  const [msg, setMsg] = useState('');
  const [dataErr, setDataErr] = useState(false);
  const [loading, setLoading] = useState(false); 
  const token = localStorage.getItem('groozifyToken'); // State to manage loading
  const navigate = useNavigate();

  // Create refs for the item and quantity inputs
  const itemInputRef = useRef(null);
  const quantityInputRef = useRef(null);

  const handleAddItem = () => {
    if (!item || !quantity) {
      setDataErr(true);
      setMsg('Please fill in item and quantity');
      return;
    }
    setGroceries([...groceries, { item, quantity }]);
    setItem('');
    setQuantity('');
    setDataErr(false);
    itemInputRef.current.focus(); // Focus back on item input after adding
  };

  const handleDeleteItem = (index) => {
    const updatedGroceries = groceries.filter((_, i) => i !== index);
    setGroceries(updatedGroceries);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || groceries.length === 0) {
      setDataErr(true);
      setMsg('Please fill in all fields and add at least one item');
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await axios.post(
        '/user/grocery-list',
        {
          name: title,
          groceries: groceries
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        }
      );

      setMsg('Grocery list saved successfully');
      setTitle('');
      setGroceries([]);
      setDataErr(false);
      navigate('/history');
    } catch (err) {
      console.error(err);
      setMsg('Failed to save grocery list');
      setDataErr(true);
    } finally {
      setLoading(false); // End loading regardless of success or error
    }
  };

  const handleButtonClick = () => {
    if (item && !quantity) {
      quantityInputRef.current.focus(); // Focus on quantity input if item is filled
    } else if (item && quantity) {
      handleAddItem(); // Add the item if both inputs are filled
    }
  };

  return (
    <div className='relative'>
      <div className="logo flex justify-between px-3 py-1">
        <h1 className='text-2xl font-extrabold'>Groozify</h1>
        <div className='flex gap-x-5 mt-1'>
          {groceries.length > 0 && (
            <ShareButton groceries={groceries} title={title} />
          )}
          <IoMdSave className='text-[27px] cursor-pointer' onClick={handleSave} />
        </div>
      </div>
        
      <form onSubmit={handleSave} className='relative'>
        <input
          type="text"
          placeholder='Title'
          className='ml-4 mt-2 p-1 border-b border-black outline-none'
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <div className="flex mx-auto lg:ml-8 mt-5 gap-x-5 w-[93%] lg:w-[50%] border border-black rounded-3xl px-3 py-2">
          <input
            type="text"
            placeholder='Item'
            className='border-b border-black outline-none w-[70%]'
            value={item}
            onChange={e => setItem(e.target.value)}
            ref={itemInputRef} // Attach ref to item input
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission
                quantityInputRef.current.focus(); // Focus on quantity input
              }
            }}
          />
          <input
            type="text"
            placeholder='Quantity'
            className='border-b border-black outline-none w-[30%]'
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            ref={quantityInputRef} // Attach ref to quantity input
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission
                handleAddItem(); // Call the add item function
              }
            }}
          />
        </div>
        <button 
          type='button' 
          className='lg:hidden fixed z-30 bg-blue-300 top-[48%] right-3 pb-2 text-3xl border border-black rounded-full py-2 px-2 font-bold cursor-pointer' 
          onClick={handleButtonClick} // Handle button click for both actions
        >
          <IoSendSharp />
        </button>
      </form>

      <ul className='w-full lg:w-[54%] lg:ml-1'>
        {groceries.map((grocery, index) => (
          <li key={index} className='border border-black rounded-3xl px-3 py-2 flex justify-between mt-2 mx-auto w-[93%]'>
            <span className='flex-1'>{grocery.item}</span> 
            <span className='flex-1'>{grocery.quantity}</span>
            <button onClick={() => handleDeleteItem(index)}>Delete</button>
          </li>
        ))}
      </ul>

      {msg && (
        <div className={`message ${dataErr ? 'error' : 'success'}`}>
          {msg}
        </div>
      )}

      {loading && <Loader />} {/* Show loader while loading */}

      <div className="fixed bottom-0 lg:top-0 left-0 lg:left-[74%] w-full lg:w-[20%]">
        <Nav />
      </div>
    </div>
  );
};

export default ListPage;
