const infuraApiKey = process.env.REACT_APP_INFURA_API;

const networks = {
  mainnet: [
    {
      name: "Ethereum",
      chainId: "0x1",
      rpcUrl: `https://mainnet.infura.io/v3/${infuraApiKey}`,
      currencySymbol: "ETH",
    },
    {
      name: "Binance Smart Chain",
      chainId: "0x38",
      rpcUrl: `https://bsc-dataseed1.binance.org/`,
      currencySymbol: "BNB",
    },
    {
      name: "Polygon",
      chainId: "0x89",
      rpcUrl: `https://polygon-mainnet.infura.io/v3/${infuraApiKey}`,
      currencySymbol: "MATIC",
    },
    {
      name: "Avalanche",
      chainId: "0xa86a",
      rpcUrl: `https://avalanche-mainnet.infura.io/v3/${infuraApiKey}`,
      currencySymbol: "AVAX",
    },
    {
      name: "Fantom",
      chainId: "0xfa",
      rpcUrl: `https://fantom-mainnet.infura.io/v3/${infuraApiKey}`,
      currencySymbol: "FTM",
    }
  ],
  testnet: [
    {
      name: "BSC-Testnet",
      chainId: "0x61",
      rpcUrl: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
      currencySymbol: "BNB",
    },
    {
      name: "Mumbai",
      chainId: "0x13881",
      rpcUrl: `https://polygon-amoy.infura.io/v3/${infuraApiKey}`,
      currencySymbol: "MATIC",
    },
    {
      name: "Fuji-Chain",
      chainId: "0xa869",
      rpcUrl: `https://avalanche-fuji.infura.io/v3/${infuraApiKey}`,
      currencySymbol: "AVAX",
    },
    {
      name: "Sepolia",
      chainId: "0x14a34",
      rpcUrl: `https://sepolia.infura.io/v3/${infuraApiKey}`,
      currencySymbol: "ETH",
    },
    {
      name: "AGRO-Testnet",
      chainId: "0xd7b",
      rpcUrl: "https://rpc.agrotest.online/",
      currencySymbol: "AGRO",
    },
  ],
  custom: []  
};

export default networks;
