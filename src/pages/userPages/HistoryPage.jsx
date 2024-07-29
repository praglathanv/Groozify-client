import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Nav from '../../components/Nav/NavBar';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import Loader from '../../components/popUp/Loader'; 

const HistoryPage = () => {
  const [groceryLists, setGroceryLists] = useState([]);
  const [error, setError] = useState('');
  const [selectedIds, setSelectedIds] = useState([]); // State to manage selected grocery list IDs
  const [loading, setLoading] = useState(false); // State to manage loading
  const token = Cookies.get('token');
  const navigate = useNavigate();
  const URL = '/user/grocery-lists';

  const fetchGroceryLists = async () => {
    setLoading(true); // Start loading when fetching data
    try {
      const response = await axios.get(URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setGroceryLists(response.data.lists); // Adjust based on the actual response structure
      } else {
        setError('Unexpected response status.');
      }
    } catch (error) {
      console.error('Error fetching grocery lists:', error);
      setError('Failed to fetch grocery lists.');
    } finally {
      setLoading(false); // End loading after fetching data
    }
  };

  useEffect(() => {
    fetchGroceryLists();
  }, []);

  const handleItemClick = (id) => {
   // console.log('Item clicked:', id); // Verify ID here
    navigate(`/edit/${id}`);
  };

  const handleSelectList = (id) => {
    setSelectedIds(prevSelected => 
      prevSelected.includes(id) 
        ? prevSelected.filter(selectedId => selectedId !== id) // Deselect if already selected
        : [...prevSelected, id] // Select if not already selected
    );
  };

  const handleDeleteMany = async () => {
    if (selectedIds.length === 0) {
      setError('Please select at least one grocery list to delete.');
      return;
    }

    setLoading(true); // Start loading when deleting data
    try {
      const response = await axios.delete(URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        data: { listIds: selectedIds } // Send the selected list IDs in the request body
      });

      if (response.status === 200) {
        setGroceryLists(groceryLists.filter(list => !selectedIds.includes(list._id))); // Update state to remove deleted lists
        setSelectedIds([]); // Clear selected IDs after deletion
        setError('Selected grocery lists deleted successfully.');
      }
    } catch (error) {
      console.error('Error deleting grocery lists:', error);
      setError('Failed to delete grocery lists.');
    } finally {
      setLoading(false); // End loading after deleting data
    }
  };

  return (
    <div>
      <div className="logo flex justify-between px-3 py-1">
        <h1 className='text-2xl font-extrabold'>Groozify</h1>
        <button onClick={handleDeleteMany} className="text-red-500 text-2xl mt-1"><MdDelete /></button>
      </div>
      {error && <div className="error-message mx-3 text-red-500">{error}</div>} 
      {loading ? (
        <Loader /> // Show loader if loading is true
      ) : (
        <div className="history flex md:flex-col flex-wrap gap-4 justify-center mt-6">
          {groceryLists.length > 0 ? (
            groceryLists.map((list) => {
              return (
                <div 
                  key={list._id || list.id || list.name} // Use unique key based on available data
                  className="list border border-black rounded-xl h-[140px] md:h-[40px] w-[160px] lg:w-[70%] md:w-[80%] md:mx-4 p-3 flex items-center justify-between"
                >
                  <div 
                    className='font-bold cursor-pointer py-14 md:py-2 w-[90%]' 
                    onClick={() => handleItemClick(list._id || list.id)}
                  >
                    {list.name} {/* Adjust based on the actual item structure */}
                  </div>
                  <input 
                    type="checkbox" 
                    className='w-[10%] h-[15px]'
                    checked={selectedIds.includes(list._id)} 
                    onChange={() => handleSelectList(list._id)} // Update selection on checkbox change
                  />
                </div>
              );
            })
          ) : (
            <div>No grocery lists available.</div>
          )}
        </div>
      )}
      {/* Display error messages if any */}
      <div className="fixed bottom-0 lg:top-0 left-0 lg:left-[74%] w-full lg:w-[20%] bg-white">
        <Nav />
      </div>
    </div>
  );
};

export default HistoryPage;
