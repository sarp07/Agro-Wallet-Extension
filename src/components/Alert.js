import React from 'react';

const Alert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className={`fixed top-0 inset-x-0 bg-yellow-600 text-black p-3 shadow-md transition transform duration-300 ease-out ${message ? 'translate-y-0' : '-translate-y-16'}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="font-bold text-lg">Uyarı:</span>
          <span className="ml-2">{message}</span>
        </div>
        <button onClick={onClose} className="bg-transparent text-2xl font-semibold leading-none rounded-full text-black outline-none focus:outline-none">
          &times;
        </button>
      </div>
    </div>
  );
};

export default Alert;
