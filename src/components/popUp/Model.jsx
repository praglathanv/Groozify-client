import React from 'react';
import './Model.css'; 

const Modal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-4 shadow-lg z-60"> {/* Ensure this has a high z-index */}
        <h2 className="text-lg font-bold mb-4">Logout Confirmation</h2>
        <p>Are you sure you want to log out?</p>
        <div className="flex justify-end mt-4">
          <button 
            className="bg-gray-300 text-black rounded px-4 py-2 mr-2" 
            onClick={onClose}
          >
            No
          </button>
          <button 
            className="bg-red-500 text-white rounded px-4 py-2" 
            onClick={onConfirm}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
