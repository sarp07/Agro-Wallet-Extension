import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WalletContext } from '../context/WalletContext';

const Home = () => {
    const { wallet, isMnemonicConfirmed } = useContext(WalletContext);
    const navigate = useNavigate();

    useEffect(() => {
      if (!isMnemonicConfirmed) {
        navigate('/');
      } else if (wallet) {
        navigate('/Dashboard');
      };
    }, [wallet, isMnemonicConfirmed, navigate]);
    
    const clickCreate = () => {
        navigate('/create');
    }

    const clickRecover = () => {
        navigate('/recover');
    }
  return (
    <div className="flex flex-col items-center justify-center p-4 h-full">
      <img src="assets/images/whitelogo.png" alt="Wallet Logo" className="w-32 h-32 mb-16" />
      <h1 className="text-3xl font-bold text-gray-300 mb-10">Hello There 👋</h1>
      <h2 className="text-xl font-bold text-gray-300 mb-10">Welcome to Agro Wallet</h2>
      <div className="flex flex-col w-full max-w-xs space-y-2">
        <button onClick={clickCreate} className="bg-green-600 hover:bg-green-700 text-white py-2 rounded mb-6">
          Create A Wallet
        </button>
        <button onClick={clickRecover} className="bg-white hover:bg-gray-200  text-green-500 py-2 rounded">
          Sign with your Phrase
        </button>
      </div>
    </div>
  );
}

export default Home;
