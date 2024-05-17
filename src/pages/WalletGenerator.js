import React, { useState, useContext } from 'react';
import { WalletContext } from '../context/WalletContext';

const WalletGenerator = () => {
  const { handleCreateWallet } = useContext(WalletContext);
  const entropy = ethers.utils.randomBytes(16);
  const mnemonic = ethers.utils.entropyToMnemonic(entropy);
  const [mnemonicPhrase, setMnemonicPhrase] = useState(mnemonic);
  const [numWallets, setNumWallets] = useState(1);
  const ethers = require("ethers")
  const { EtherscanProvider } = require('ethers');


  const generateWallets = () => {
    const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonicPhrase);
    for (let i = 0; i < numWallets; i++) {
      const wallet = hdNode.derivePath(`m/44'/60'/0'/0/${i}`);
      handleCreateWallet(wallet);
    }
  };

  return (
    <div>
      <h2>Wallet Generator</h2>
      <div>
        <label>
          Mnemonic:
          <input type="text" value={mnemonicPhrase} onChange={(e) => setMnemonicPhrase(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Number of Wallets:
          <input type="number" value={numWallets} onChange={(e) => setNumWallets(Number(e.target.value))} min="1" />
        </label>
      </div>
      <button onClick={generateWallets}>Generate Wallets</button>
    </div>
  );
};

export default WalletGenerator;
