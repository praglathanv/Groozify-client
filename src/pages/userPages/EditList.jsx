import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { IoMdSave } from 'react-icons/io';
import ShareButton from '../../components/Nav/ShareButton'; 
import Nav from '../../components/Nav/NavBar';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { IoSendSharp } from 'react-icons/io5';
import Loader from '../../components/popUp/Loader'; 

const EditList = () => {
  const { id } = useParams(); // Get list ID from route parameters
  const [title, setTitle] = useState('');
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [groceries, setGroceries] = useState([]); // State to manage the list of groceries
  const [msg, setMsg] = useState('');
  const [dataErr, setDataErr] = useState(false);
  const [loading, setLoading] = useState(false); // State to manage loading
  const navigate = useNavigate();
  const token = localStorage.getItem('groozifyToken'); 
  const itemInputRef = useRef(null);
  const quantityInputRef = useRef(null);

  // Fetch the list data
  useEffect(() => {

    const fetchListData = async () => {
      setLoading(true); // Start loading when fetching data
      try {
        const response = await axios.get(`/user/grocery-lists/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          setTitle(response.data.groceryList?.name || '');
          setGroceries(response.data.groceryList?.groceries || []);
        }
      } catch (error) {
        console.error('Error fetching list data:', error);
      } finally {
        setLoading(false); // End loading after data fetch
      }
    };

    if (id) {
      fetchListData();
    }
  }, [id]);

  const handleAddItem = () => {
    if (!item || !quantity) {
      setDataErr(true);
      setMsg('Please fill in item and quantity');
      return;
    }
    // Avoid adding duplicate items
    const itemExists = groceries.some(g => g.item === item);
    if (itemExists) {
      setDataErr(true);
      setMsg('Item already exists in the list');
      return;
    }
    // Add the new item to the groceries list
    setGroceries([...groceries, { item, quantity }]);
    // Clear item and quantity inputs
    setItem('');
    setQuantity('');
    setDataErr(false);
  };

  const handleDeleteItem = async (itemId) => {
    console.log('Attempting to delete item with ID:', itemId);
    try {
      const response = await axios.delete(`/user/grocery-lists/${id}/items/${itemId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 200) {
        // Filter out the deleted item from the groceries state
        setGroceries((prevGroceries) => prevGroceries.filter(grocery => grocery._id !== itemId));
        setMsg('Grocery item deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting grocery item:', error.response?.data?.error || error.message);
      setMsg('Failed to delete grocery item');
      setDataErr(true);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (!title || groceries.length === 0) {
      setDataErr(true);
      setMsg('Please fill in all fields and add at least one item');
      return;
    }

    setLoading(true); // Start loading when saving data
    try {
      // Make a PUT request to save the edited grocery list
      const response = await axios.put(
        `/user/grocery-lists/${id}`,
        {
          name: title,
          groceries: groceries // Send the list of groceries
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Use token for authentication if needed
          }
        }
      );

      // Handle success
      setMsg('Grocery list saved successfully');
      navigate('/history'); // Navigate to history page or any other desired page
    } catch (err) {
      // Handle error
      console.error(err);
      setMsg('Failed to save grocery list');
      setDataErr(true);
    } finally {
      setLoading(false); // End loading after saving data
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
      {loading ? (
        <Loader /> // Show loader if loading is true
      ) : (
        <>
          <div className="logo flex justify-between px-3 py-1">
            <h1 className='text-2xl font-extrabold'>Groozify</h1>
            <div className='flex gap-x-5 mt-1'>
              <ShareButton groceries={groceries} title={title} /> 
              <IoMdSave className='text-[27px] cursor-pointer' onClick={handleSave} />
            </div>
          </div>

          <form onSubmit={handleSave}>
            <input
              type="text"
              placeholder='Title'
              value={title}
              className='ml-4 mt-2 p-1 border-b border-black outline-none'
              onChange={e => setTitle(e.target.value)}
            />
            
            {msg && (
              <div className={`message ${dataErr ? 'error' : 'success'} mt-3 ml-3`}>
                {msg}
              </div>
            )}
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
              className='lg:hidden fixed z-50 bg-blue-300 top-[48%] right-3 pb-2 text-3xl border border-black rounded-full py-2 px-2 font-bold cursor-pointer' 
              onClick={handleButtonClick} // Handle button click for both actions
            >
              <IoSendSharp />
            </button>
          </form>

          <ul className='w-full lg:w-[54%] lg:ml-1'>
            {groceries.map((grocery) => (
              <li key={grocery._id} className='border border-black rounded-3xl px-3 py-2 flex justify-between mt-2 mx-auto w-[93%]'>
                <span className='flex-1'>{grocery.item}</span> 
                <span className='flex-1'>{grocery.quantity}</span>
                <button onClick={() => handleDeleteItem(grocery._id)}>Delete</button>
              </li>
            ))}
          </ul>

          <div className="fixed bottom-0 lg:top-0 left-0 lg:left-[74%] w-full lg:w-[20%]">
            <Nav />
          </div>
        </>
      )}
    </div>
  );
};

export default EditList;
