import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaShare } from 'react-icons/fa';
import { IoLogoWhatsapp } from 'react-icons/io';

const ShareButton = ({ groceries, title }) => {
  const [shareUrl, setShareUrl] = useState('');
  const [error, setError] = useState('');

  const handleShare = async () => {
    try {
      const response = await axios.post(
        '/share',
        {
          groceries,
          name: title
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}` 
          }
        }
      );

      if (response.status === 200) {
        setShareUrl(response.data.shareUrl); 
        setError(''); 
      }
    } catch (err) {
      console.error('Error sharing grocery list:', err);
      setError('Failed to create share link. Please try again.');
    }
  };

  return (
    <div>
      <button onClick={handleShare} className="share-button">
         <FaShare className='text-[24px] mt-[1.5px] cursor-pointer' />
      </button>
      {shareUrl && (
        <div>
          <a href={shareUrl} target="_blank" rel="noopener noreferrer">
            <IoLogoWhatsapp className='text-3xl'/>
          </a>
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ShareButton;
