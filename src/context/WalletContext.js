import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { Alert, AlertTitle, Container } from "@mui/material";
import networksConfig from "../utils/networks";

const ENCRYPTION_KEY = process.env.REACT_APP_SECRET_KEY;

const saveToLocalStorage = (key, data) => {
  try {
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(data, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      ),
      ENCRYPTION_KEY
    ).toString();
    localStorage.setItem(key, encryptedData);
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

const loadFromLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    if (data) {
      const bytes = CryptoJS.AES.decrypt(data, ENCRYPTION_KEY);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedData;
    }
    return null;
  } catch (error) {
    console.error("Error loading data:", error);
    return null;
  }
};

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const navigate = useNavigate();
  const [wallets, setWallets] = useState([]);
  const [activeWalletIndex, setActiveWalletIndex] = useState(0);
  const [wallet, setWallet] = useState(null);
  const [mnemonicPhrase, setMnemonicPhrase] = useState("");
  const [privKey, setPrivKey] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState({
    category: "testnet",
    network: "AGRO-Testnet",
  });
  const [balance, setBalance] = useState("Loading...");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [password, setPassword] = useState("");
  const [networks, setNetworks] = useState({
    ...networksConfig,
    custom: loadFromLocalStorage("customNetworks") || [],
  });
  const [tokens, setTokens] = useState([]);
  const [NFTs, setNFTs] = useState([]);
  const [maxAmount, setMaxAmount] = useState("");
  const [isMnemonicConfirmed, setIsMnemonicConfirmed] = useState(false);
  const [gasPrice, setGasPrice] = useState("");
  const [provider, setProvider] = useState();
  const [transactions, setTransactions] = useState(
    loadFromLocalStorage("transactions") || {}
  );

  const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function balanceOf(address) view returns (uint)",
  ];

  const NFT_ABI = [
    "function tokenURI(uint256 tokenId) view returns (string)",
    "function ownerOf(uint256 tokenId) view returns (address)",
  ];

  useEffect(() => {
    const walletData = loadFromLocalStorage("walletData");
    const activeWalletIndex = loadFromLocalStorage("activeWalletIndex");
    if (walletData) {
      setWallets(walletData.wallets || []);
      setIsMnemonicConfirmed(walletData.isMnemonicConfirmed || false);
      if (walletData.wallets && walletData.wallets.length > 0) {
        setActiveWalletData(walletData.wallets[activeWalletIndex || 0]);
      }
    }
    if (activeWalletIndex !== null) {
      setActiveWalletIndex(activeWalletIndex);
    }
  }, []);

  useEffect(() => {
    const loadWallet = async () => {
      const networkCategory = networks[selectedNetwork.category];
      const networkConfig = networkCategory.find(
        (net) => net.name === selectedNetwork.network
      );

      if (!networkConfig) {
        console.error(`Network configuration for '${selectedNetwork.network}' not found.`);
        setBalance("Network Error");
        return;
      }

      const activeWallet = wallets[activeWalletIndex];
      if (activeWallet) {
        const newProvider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);
        const newWallet = new ethers.Wallet(activeWallet.privKey, newProvider);
        const balanceWei = await newProvider.getBalance(newWallet.address);
        const formattedBalance = ethers.formatEther(balanceWei);
        setProvider(newProvider);
        setBalance(formattedBalance);
        setActiveWalletData(activeWallet);
      }
    };

    loadWallet();
  }, [wallets, activeWalletIndex, selectedNetwork]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.ethereum = {
        isMetaMask: true,
        request: async ({ method, params }) => {
          switch (method) {
            case "eth_requestAccounts":
              return [wallet];
            case "eth_chainId":
              return ethers.toQuantity(selectedNetwork.chainId);
            case "eth_sendTransaction":
              const tx = {
                to: params[0].to,
                value: params[0].value,
                gasPrice: params[0].gasPrice,
                gas: params[0].gas,
              };
              const signer = provider.getSigner(wallet);
              const transactionResponse = await signer.sendTransaction(tx);
              return transactionResponse.hash;
            // Diğer gerekli RPC metotları için case blokları ekleyin.
            default:
              throw new Error(`Method ${method} not supported.`);
          }
        },
        on: (eventName, callback) => {
          switch (eventName) {
            case "accountsChanged":
              window.addEventListener("wallet_accountChanged", callback);
              break;
            case "chainChanged":
              window.addEventListener("wallet_chainChanged", callback);
              break;
            default:
              break;
          }
        },
        removeListener: (eventName, callback) => {
          switch (eventName) {
            case "accountsChanged":
              window.removeEventListener("wallet_accountChanged", callback);
              break;
            case "chainChanged":
              window.removeEventListener("wallet_chainChanged", callback);
              break;
            default:
              break;
          }
        },
      };
    }
  }, [wallet, selectedNetwork, provider]);

  useEffect(() => {
    saveToLocalStorage("activeWalletIndex", activeWalletIndex);
  }, [activeWalletIndex]);

  const setActiveWalletData = (wallet) => {
    setWallet(wallet.address);
    setMnemonicPhrase(wallet.mnemonicPhrase);
    setPrivKey(wallet.privKey);
    saveToLocalStorage("activeWallet", wallet);
  };

  const addTransaction = (tx, walletAddress) => {
    const updatedTransactions = { ...transactions };
    if (!updatedTransactions[walletAddress]) {
      updatedTransactions[walletAddress] = [];
    }
    if (!updatedTransactions[walletAddress].find(t => t.hash === tx.hash)) {
      updatedTransactions[walletAddress] = [tx, ...updatedTransactions[walletAddress]].slice(0, 10); // Limit to 10 transactions
      setTransactions(updatedTransactions);
      saveToLocalStorage("transactions", updatedTransactions);
    }
  };

  const sendTransaction = async (to, value) => {
    if (!wallets[activeWalletIndex]) return;
    const tx = await wallets[activeWalletIndex].sendTransaction({
      to,
      value: ethers.parseEther(value)
    });
    await tx.wait();
    addTransaction(tx, wallets[activeWalletIndex].address);
    console.log('Transaction success:', tx);
  };

  const sendNativeToken = async (recipientAddress, amount) => {
    if (!wallet || !recipientAddress || !amount) {
      setAlertMessage("Please check your input fields.");
      setAlertType("error");
      return;
    }

    try {
      const networkDetails = networksConfig[selectedNetwork.category].find(
        (net) => net.name === selectedNetwork.network
      );
      if (!networkDetails || !networkDetails.rpcUrl) {
        console.error("Network details or RPC URL not found.");
        return;
      }

      const provider = new ethers.JsonRpcProvider(networkDetails.rpcUrl);
      const senderWallet = new ethers.Wallet(privKey, provider);

      const formattedAmount =
        typeof amount === "string" ? amount : String(amount);

      const txResponse = await senderWallet.sendTransaction({
        to: recipientAddress,
        value: ethers.parseEther(formattedAmount), // Ensure amount is a string
      });
      await txResponse.wait();
      setAlertMessage("Transaction successful!");
      setAlertType("success");
      addTransaction(txResponse, wallet);
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 2200);
      refreshBalance();
    } catch (error) {
      console.error("Transaction failed:", error);
      setAlertMessage("Transaction failed.");
      setAlertType("error");
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 2200);
    }
  };

  const sendToken = async (toAddress, amount, tokenAddress) => {
    const networkCategory = networks[selectedNetwork.category];
    const networkConfig = networkCategory.find(
      (net) => net.name === selectedNetwork.network
    );

    if (!networkConfig || !networkConfig.rpcUrl) {
      console.error("Network konfigürasyonu bulunamadı!");
      return;
    }

    const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);

    try {
      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ERC20_ABI,
        signer
      );
      const transactionResponse = await tokenContract.transfer(
        toAddress,
        ethers.parseUnits(amount, "ether")
      );
      await transactionResponse.wait();
      setAlertMessage("Token sended successfully!", transactionResponse.hash);
      setAlertType("success");
      addTransaction(transactionResponse, wallet);
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 2200);
      console.log(`Token başarıyla gönderildi: ${transactionResponse.hash}`);
    } catch (error) {
      console.error("Token gönderimi sırasında hata oluştu: ", error);
    }
  };

  const handleCreateWallet = async () => {
    try {
      const randomWallet = ethers.Wallet.createRandom();
      const newWallet = {
        address: randomWallet.address,
        privKey: randomWallet.privateKey,
        mnemonicPhrase: randomWallet.mnemonic.phrase,
      };

      const updatedWallets = [...wallets, newWallet];
      saveToLocalStorage("walletData", { wallets: updatedWallets, isMnemonicConfirmed });
      setWallets(updatedWallets);
      setActiveWalletIndex(updatedWallets.length - 1);
      setActiveWalletData(newWallet);
      console.log("Wallet created and saved successfully");
    } catch (error) {
      console.error("Failed to create the wallet:", error);
      setAlertMessage("Failed to create the wallet. Please try again.");
      setAlertType("error");
    }
  };

  const verifyMnemonic = (userInputMnemonic) => {
    if (mnemonicPhrase === userInputMnemonic) {
      setIsMnemonicConfirmed(true);
      const walletData = loadFromLocalStorage("walletData");
      walletData.isMnemonicConfirmed = true;
      saveToLocalStorage("walletData", walletData);
      setAlertMessage("Success! Mnemonic phrases confirmed.");
      setAlertType("success");
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
        navigate("/dashboard");
      }, 2200);
    } else {
      setAlertMessage("Mnemonic mismatch. Please try again.");
      setAlertType("error");
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 1200);
    }
  };

  const createPassword = async (password, confirmPassword) => {
    if (!password || !confirmPassword) {
      setAlertMessage("Both password fields must be filled!");
      setAlertType("warning");
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 2200);
      return;
    } else if (password !== confirmPassword) {
      setAlertMessage("Passwords do not match!");
      setAlertType("warning");
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 2200);
      return;
    } else {
      const encryptedPassword = CryptoJS.AES.encrypt(
        password,
        ENCRYPTION_KEY
      ).toString();
      localStorage.setItem("password", encryptedPassword);
      setPassword(password);
      setAlertMessage("Password created successfully!");
      setAlertType("success");
      setTimeout(() => {
        navigate("/Generate");
        setAlertMessage("");
        setAlertType("");
      }, 2200);
      console.log("Password created and saved successfully");
    }
  };

  const recoverWallet = (mnemonic, password, confirmPassword) => {
    if (!mnemonic || !password || !confirmPassword) {
      setAlertMessage("All fields must be filled!");
      setAlertType("warning");
      return;
    }
    if (password !== confirmPassword) {
      setAlertMessage("Passwords do not match!");
      setAlertType("warning");
      return;
    }

    try {
      const wallet = ethers.Wallet.fromPhrase(mnemonic);
      const newWallet = {
        address: wallet.address,
        privKey: wallet.privateKey,
        mnemonicPhrase: mnemonic,
        password: password,
      };

      const updatedWallets = [...wallets, newWallet];
      saveToLocalStorage("walletData", { wallets: updatedWallets, isMnemonicConfirmed });
      setWallets(updatedWallets);
      setActiveWalletIndex(updatedWallets.length - 1);
      setActiveWalletData(newWallet);
      setAlertMessage("Wallet recovered successfully!");
      setAlertType("success");
      setTimeout(() => {
        navigate("/Dashboard");
        setAlertMessage("");
        setAlertType("");
        setIsMnemonicConfirmed(true);
        const walletData = loadFromLocalStorage("walletData");
        walletData.isMnemonicConfirmed = true;
        saveToLocalStorage("walletData", walletData);
      }, 2000);
      console.log("Wallet recovered and data saved successfully");
    } catch (error) {
      console.error("Failed to recover wallet:", error);
      setAlertMessage("Failed to recover wallet.", error);
      setAlertType("error");
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 2000);
    }
  };

  const refreshBalance = async () => {
    if (!wallet || !selectedNetwork) return;

    const networkCategory = networks[selectedNetwork.category];
    const networkConfig = networkCategory.find(
      (net) => net.name === selectedNetwork.network
    );

    if (!networkConfig) {
      console.error(
        `Network configuration for '${selectedNetwork.network}' not found.`
      );
      setBalance("Network Error");
      return;
    }

    try {
      const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);
      const balanceWei = await provider.getBalance(wallet);
      const formattedBalance =
        ethers.formatEther(balanceWei) + " " + networkConfig.currencySymbol;
      setBalance(formattedBalance);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      setBalance("Error");
    }
  };

  const addToken = async (tokenAddress) => {
    const networkCategory = networks[selectedNetwork.category];
    const networkConfig = networkCategory.find(
      (net) => net.name === selectedNetwork.network
    );

    const existingTokensEncrypted = localStorage.getItem("tokens");
    const existingTokens = existingTokensEncrypted
      ? JSON.parse(
          CryptoJS.AES.decrypt(
            existingTokensEncrypted,
            ENCRYPTION_KEY
          ).toString(CryptoJS.enc.Utf8)
        )
      : [];

    if (existingTokens.some((token) => token.address === tokenAddress)) {
      setAlertMessage("Token already added!");
      setAlertType("warning");
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 2200);
      return;
    }

    if (!networkConfig || !networkConfig.rpcUrl) {
      console.error("Network configuration not found!");
      return;
    }

    const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);

    try {
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ERC20_ABI,
        provider
      );
      const name = await tokenContract.name();
      const symbol = await tokenContract.symbol();
      const decimals = await tokenContract.decimals();
      const balanceInWei = await tokenContract.balanceOf(wallet);
      const balanceInEther = ethers.formatUnits(balanceInWei, decimals);
      const balanceToDisplay = parseFloat(balanceInEther).toFixed(3);

      const newToken = {
        address: tokenAddress,
        name,
        symbol,
        decimals,
        balance: balanceToDisplay,
        network: selectedNetwork.network,
      };
      existingTokens.push(newToken);

      setTokens(existingTokens);

      const updatedTokensString = JSON.stringify(existingTokens, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      );
      const tokens = CryptoJS.AES.encrypt(
        updatedTokensString,
        ENCRYPTION_KEY
      ).toString();
      localStorage.setItem("tokens", tokens);

      setAlertMessage("Token added successfully!");
      setAlertType("success");
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 2200);
    } catch (error) {
      console.error("Error adding token: ", error);
      setAlertMessage("Oops! Something goes wrong.");
      setAlertType("error");
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 2200);
    }
  };

  useEffect(() => {
    if (tokens.length > 0) {
      saveToLocalStorage("tokens", tokens);
    }
  }, [tokens]);

  const addNFT = async (nftAddress, tokenId) => {
    const networkCategory = networks[selectedNetwork.category];
    const networkConfig = networkCategory.find(
      (net) => net.name === selectedNetwork.network
    );

    if (!networkConfig || !networkConfig.rpcUrl) {
      console.error("Network configuration not found!");
      setAlertMessage("Network configuration not found!");
      setAlertType("error");
      return;
    }

    const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);

    try {
      const nftContract = new ethers.Contract(nftAddress, NFT_ABI, provider);
      const [owner, tokenURI] = await Promise.all([
        nftContract.ownerOf(tokenId),
        nftContract.tokenURI(tokenId),
      ]);

      if (owner.toLowerCase() !== wallet.toLowerCase()) {
        setAlertMessage("You are not the owner of this NFT!");
        setAlertType("error");
        setTimeout(() => {
          setAlertMessage("");
          setAlertType("");
        }, 2000);
        return;
      }

      const newNFT = {
        address: nftAddress,
        tokenId,
        tokenURI,
        network: selectedNetwork.network,
      };

      const updatedNFTs = [...NFTs, newNFT];
      setNFTs(updatedNFTs);
      saveToLocalStorage("nfts", updatedNFTs);

      setAlertMessage("NFT added successfully!");
      setAlertType("success");
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 2000);
    } catch (error) {
      console.error("Failed to add NFT: ", error);
      setAlertMessage("Failed to add NFT.");
      setAlertType("error");
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 2000);
    }
  };

  useEffect(() => {
    const savedNFTs = loadFromLocalStorage("nfts");
    if (savedNFTs) {
      setNFTs(savedNFTs);
    }
  }, []);

  const setSelectedNetworkConfig = (category, networkName) => {
    const newNetworkConfig = { category, network: networkName };
    setSelectedNetwork(newNetworkConfig);
    saveToLocalStorage("selectedNetwork", newNetworkConfig);
  };

  useEffect(() => {
    const savedNetwork = loadFromLocalStorage("selectedNetwork");
    if (savedNetwork) {
      setSelectedNetwork(savedNetwork);
    }
  }, []);

  useEffect(() => {
    if (wallet && selectedNetwork && selectedNetwork?.network) {
      refreshBalance();
    }
  }, [selectedNetwork, selectedNetwork.network, wallet]);

  useEffect(() => {
    const walletData = loadFromLocalStorage("walletData");
    const savedTokens = loadFromLocalStorage("tokens");

    if (walletData) {
      setWallets(walletData.wallets);
      setIsMnemonicConfirmed(walletData.isMnemonicConfirmed || false);
      setActiveWalletData(walletData.wallets[0]);
    }

    if (savedTokens) {
      setTokens(savedTokens);
    }
  }, []);

  const updatePassword = async (currentPassword, newPassword) => {
    const encryptedCurrentPassword = localStorage.getItem("password");
    if (!encryptedCurrentPassword) {
      setAlertMessage("No existing password found. Set up a new password.");
      setAlertType("error");
      return;
    }

    const decryptedCurrentPassword = CryptoJS.AES.decrypt(
      encryptedCurrentPassword,
      ENCRYPTION_KEY
    ).toString(CryptoJS.enc.Utf8);

    if (decryptedCurrentPassword !== currentPassword) {
      setAlertMessage("Current password is incorrect!");
      setAlertType("error");
      return;
    }

    if (currentPassword === newPassword) {
      setAlertMessage("New password must be different from current password!");
      setAlertType("error");
      return;
    }

    const encryptedNewPassword = CryptoJS.AES.encrypt(
      newPassword,
      ENCRYPTION_KEY
    ).toString();
    localStorage.setItem("password", encryptedNewPassword);

    setAlertMessage("Password updated successfully!");
    setAlertType("success");
    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
      navigate("/Dashboard");
    }, 2200);
  };

  const addCustomNetwork = async (network) => {
    const updatedNetworks = {
      ...networks,
      custom: [...networks.custom, network],
    };
    try {
      setNetworks(updatedNetworks);
      saveToLocalStorage("customNetworks", updatedNetworks.custom);
      setAlertMessage("Custom Network added successfully!");
      setAlertType("success");
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
        navigate("/Dashboard");
      }, 2200);
    } catch (error) {}
  };

  const saveUserData = () => {
    const walletData = {
      wallets,
      isMnemonicConfirmed,
      tokens,
      NFTs,
      networks,
    };
    saveToLocalStorage("walletData", walletData);
  };

  const calculateMaxAmount = async () => {
    if (!wallet || !selectedNetwork) {
      console.error("Wallet or network configuration is missing.");
      return;
    }

    const networkDetails = networksConfig[selectedNetwork.category].find(
      (net) => net.name === selectedNetwork.network
    );
    if (!networkDetails || !networkDetails.rpcUrl) {
      console.error("Network details or RPC URL not found.");
      return;
    }

    const provider = new ethers.JsonRpcProvider(networkDetails.rpcUrl);
    try {
      let formattedGasPrice;
      const isBSC = networkDetails.chainId === "0x61" || networkDetails.chainId === "0x38";
      if (isBSC) {
        // BSC için sabit gas ücreti kullan
        formattedGasPrice = "0.000110000000000";
      } else {
        // Diğer ağlar için dinamik gas ücreti kullan
        const feeData = await provider.getFeeData();
        formattedGasPrice = ethers.formatUnits(feeData.maxFeePerGas.toString(), "ether");
      }

      setGasPrice(formattedGasPrice);
      localStorage.setItem("gasPrice", formattedGasPrice);

      // Burada hesap bakiyesini kontrol ediyoruz
      const balance = await provider.getBalance(wallet);
      const balanceEth = ethers.formatUnits(balance, "ether");
      const maxBalance = balanceEth - formattedGasPrice;
      setMaxAmount(maxBalance);
    } catch (error) {
      console.error("Error calculating balance or fetching gas price:", error);
      setMaxAmount("0");
    }
  };

  useEffect(() => {
    async function fetchGasPrice() {
      if (!wallet || !selectedNetwork) {
        console.error("Wallet or network configuration is missing.");
        return;
      }

      const networkDetails = networksConfig[selectedNetwork.category].find(
        (net) => net.name === selectedNetwork.network
      );
      if (!networkDetails || !networkDetails.rpcUrl) {
        console.error("Network details or RPC URL not found.");
        return;
      }
      const isBSC =
        networkDetails.chainId === "0x61" || networkDetails.chainId === "0x38";
      if (isBSC) {
        setGasPrice("0.000110000000000"); // Sabit ücreti BNB cinsinden ayarla
        localStorage.setItem("gasPrice", "0.0000079");
      } else {
        const provider = new ethers.JsonRpcProvider(networkDetails.rpcUrl);
        try {
          const feeData = await provider.getFeeData();
          const formattedGasPrice = ethers.formatUnits(
            feeData.maxFeePerGas.toString(),
            "ether"
          );
          setGasPrice(formattedGasPrice);
          localStorage.setItem("gasPrice", formattedGasPrice);
        } catch (error) {
          console.error("Error fetching gas price:", error);
        }
      }
    }

    fetchGasPrice();
  }, [selectedNetwork]);

  const logout = () => {
    localStorage.clear();
    setWallets([]);
    setWallet(null);
    setMnemonicPhrase("");
    setPrivKey("");
    setIsMnemonicConfirmed(false);
    setSelectedNetwork(null);
    setBalance("Loading...");
    navigate("/");
  };

  const contextValue = {
    wallets,
    activeWallet: wallets[activeWalletIndex],
    wallet,
    mnemonicPhrase,
    privKey,
    selectedNetwork,
    balance,
    alertMessage,
    alertType,
    setAlertMessage,
    setAlertType,
    handleCreateWallet,
    setActiveWalletIndex,
    setSelectedNetwork,
    setSelectedNetworkConfig,
    createPassword,
    updatePassword,
    refreshBalance,
    sendToken,
    sendNativeToken,
    networks,
    addCustomNetwork,
    gasPrice,
    verifyMnemonic,
    isMnemonicConfirmed,
    recoverWallet,
    provider,
    sendTransaction,
    addToken,
    tokens,
    maxAmount,
    calculateMaxAmount,
    NFTs,
    addNFT,
    logout,
    transactions,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
      {alertMessage && (
        <Container
          maxWidth="sm"
          style={{
            position: "fixed",
            top: "10px",
            display: "flex",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <Alert severity={alertType} onClose={() => setAlertMessage("")}>
            <AlertTitle>{alertType}</AlertTitle>
            {alertMessage}
          </Alert>
        </Container>
      )}
    </WalletContext.Provider>
  );
};
