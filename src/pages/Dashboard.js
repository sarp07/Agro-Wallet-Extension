import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
  Button,
  Tabs,
  Tab,
  Paper,
  Container,
  AppBar,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  CircularProgress,
  CssBaseline,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  SettingsOutlined,
  LanguageOutlined,
  ExitToAppOutlined,
  Refresh as RefreshIcon,
  CopyAllOutlined,
  Link as LinkIcon,
} from "@mui/icons-material";
import { WalletContext } from "../context/WalletContext";
import { useNavigate } from "react-router-dom";
import AddTokenModal from "../components/TokenModal";
import AddNFTModal from "../components/NftModal";
import NFTImage from "../components/NFTImage";
import PaymentsIcon from "@mui/icons-material/Payments";
import AddIcon from "@mui/icons-material/Add";
import { Send as SendIcon, ShoppingCart as ShoppingCartIcon } from "@mui/icons-material";
import { ethers } from "ethers";

function a11yProps(index) {
  return {
    id: `dashboard-tab-${index}`,
    "aria-controls": `dashboard-tabpanel-${index}`,
  };
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Dashboard = () => {
  const {
    wallets,
    activeWallet,
    setActiveWalletIndex,
    handleCreateWallet,
    wallet,
    balance,
    refreshBalance,
    selectedNetwork,
    setAlertMessage,
    networks,
    setAlertType,
    tokens,
    logout,
    NFTs,
    provider,
    transactions,
  } = useContext(WalletContext);
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [isAddTokenModalOpen, setAddTokenModalOpen] = useState(false);
  const [isAddNFTModalOpen, setAddNFTModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isConnectModalOpen, setConnectModalOpen] = useState(false);

  useEffect(() => {
    if (selectedNetwork && selectedNetwork?.network) {
      setLoading(false);
      refreshBalance();
    }
  }, [selectedNetwork?.network]);

  const networkInfo = networks[selectedNetwork?.category]?.find(
    (net) => net.name === selectedNetwork?.network
  ) || {
    name: "No network",
    currencySymbol: "N/A",
  };

  const walletAddress = wallet
    ? `0x${wallet.slice(2, 6)}...${wallet.slice(-4)}`
    : "No Wallet Address";
  const formattedBalance = parseFloat(balance).toFixed(4);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCopyAddress = () => {
    try {
      navigator.clipboard.writeText(wallet);
      setAlertMessage("Wallet address copied!");
      setAlertType("success");
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 2000);
    } catch (error) {
      setAlertMessage("Uups! Something goes wrong.");
      setAlertType("error");
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 2000);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleWalletSelect = (index) => {
    setActiveWalletIndex(index);
    handleMenuClose();
  };

  const handleCreateNewWallet = () => {
    handleCreateWallet();
    handleMenuClose();
  };

  const handleOpenAddTokenModal = () => setAddTokenModalOpen(true);
  const handleCloseAddTokenModal = () => setAddTokenModalOpen(false);

  const handleOpenAddNFTModal = () => setAddNFTModalOpen(true);
  const handleCloseAddNFTModal = () => setAddNFTModalOpen(false);

  const handleOpenConnectModal = () => setConnectModalOpen(true);
  const handleCloseConnectModal = () => setConnectModalOpen(false);

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

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!selectedNetwork || !selectedNetwork.network) {
    return (
      <Typography variant="h6" align="center">
        Ağ bilgisi yüklenemedi. Lütfen tekrar deneyin.
      </Typography>
    );
  }

  return (
    <>
      <CssBaseline />
      <Box sx={{ pb: 2, mb: 5 }}>
        <AppBar
          position="static"
          color="success"
          sx={{ height: "48px", minHeight: "48px" }}
        >
          <Toolbar
            sx={{
              minHeight: "48px",
              justifyContent: "space-between",
              padding: "0 12px",
            }}
          >
            <Typography
              variant="h6"
              noWrap
              sx={{ fontSize: "0.9rem", cursor: "pointer" }}
              onClick={handleMenuOpen}
            >
              Acc ({wallets.length}) ▼
            </Typography>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {wallets.map((wallet, index) => (
                <MenuItem
                  key={index}
                  onClick={() => handleWalletSelect(index)}
                >
                  {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                </MenuItem>
              ))}
              <MenuItem onClick={handleCreateNewWallet}>
                <AddIcon /> Create New Wallet
              </MenuItem>
            </Menu>
            <Typography
              onClick={() => navigate("/Networks")}
              style={{ cursor: "pointer" }}
              variant="h6"
              noWrap
              sx={{ fontSize: "0.9rem" }}
            >
              {selectedNetwork?.network || "Network Seçilmedi"}
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm" sx={{ mt: 2 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backdropFilter: "blur(10px)",
              background: "transparent",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <img
                src="assets/images/whitelogo.png"
                alt="Wallet Logo"
                className="w-20 h-20 mb-6"
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", flexGrow: 1 }}
              >
                {walletAddress}
              </Typography>
              <IconButton color="inherit" onClick={handleCopyAddress}>
                <CopyAllOutlined />
              </IconButton>
            </Box>
            <Typography variant="h6" sx={{ my: 2, fontWeight: "lighter" }}>
              {formattedBalance} {networkInfo.currencySymbol}
            </Typography>
          </Paper>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              padding: "20px",
              borderRadius: "4px",
              boxShadow: 1,
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <IconButton
                color="inherit"
                disabled
                aria-label="buy/sell"
              >
                <ShoppingCartIcon sx={{ color: "darkgray" }} />
              </IconButton>
              <Typography
                sx={{
                  color: "darkgray",
                  fontFamily: "Roboto, sans-serif",
                  fontWeight: "300",
                }}
              >
                Buy/Sell
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <IconButton
                color="inherit"
                aria-label="stake"
                sx={{
                  color: ["AGRO-Testnet", "Binance Smart Chain"].includes(
                    selectedNetwork?.network
                  )
                    ? "white"
                    : "darkgray",
                  cursor: ["AGRO-Testnet", "Binance Smart Chain"].includes(
                    selectedNetwork?.network
                  )
                    ? "pointer"
                    : "default",
                }}
                onClick={() => {
                  if (
                    ["AGRO-Testnet", "Binance Smart Chain"].includes(
                      selectedNetwork?.network
                    )
                  ) {
                    navigate("/StakePage");
                  }
                }}
              >
                <PaymentsIcon />
              </IconButton>
              <Typography
                sx={{
                  color: ["AGRO-Testnet", "Binance Smart Chain"].includes(
                    selectedNetwork?.network
                  )
                    ? "white"
                    : "darkgray",
                  cursor: ["AGRO-Testnet", "Binance Smart Chain"].includes(
                    selectedNetwork?.network
                  )
                    ? "pointer"
                    : "default",
                  fontFamily: "Roboto, sans-serif",
                  fontWeight: "300",
                }}
              >
                Stake
              </Typography>
            </Box>
            <Box
              sx={{ textAlign: "center" }}
              onClick={() => navigate("/SendPage")}
            >
              <IconButton color="inherit" aria-label="send/receive">
                <SendIcon sx={{ color: "white" }} />
              </IconButton>
              <Typography
                sx={{
                  color: "white",
                  fontFamily: "Roboto, sans-serif",
                  fontWeight: "300",
                }}
              >
                Send
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <IconButton
                color="inherit"
                onClick={handleOpenConnectModal}
                aria-label="connect"
              >
                <LinkIcon sx={{ color: "white" }} />
              </IconButton>
              <Typography
                sx={{
                  color: "white",
                  fontFamily: "Roboto, sans-serif",
                  fontWeight: "300",
                }}
              >
                Connect
              </Typography>
            </Box>
          </Box>
          <Tabs
            value={tabValue}
            onChange={handleChange}
            aria-label="dashboard tabs"
          >
            <Tab
              sx={{
                color: "white",
              }}
              label="Tokens"
              {...a11yProps(0)}
            />
            <Tab
              sx={{
                color: "white",
              }}
              label="NFTs"
              {...a11yProps(1)}
            />
            <Tab
              sx={{
                color: "white",
              }}
              label="Activities"
              {...a11yProps(2)}
            />
          </Tabs>
          <CustomTabPanel value={tabValue} index={0}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {tokens
                .filter((token) => token.network === selectedNetwork.network)
                .map((token, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1,
                      bgcolor: "rgba(255, 255, 255, 0.25)",
                      borderRadius: "4px",
                      boxShadow: 1,
                      background: "blur(20px)",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Box
                        sx={{
                          width: 35,
                          height: 35,
                          bgcolor: "secondary.main",
                          borderRadius: "50%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "1rem",
                        }}
                      >
                        {token.symbol[0]}
                      </Box>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: "bold" }}
                        >
                          {token.symbol}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          {token.name}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      onClick={() =>
                        navigate("/SendToken", { state: { token } })
                      }
                      style={{
                        color: "#fff",
                      }}
                    >
                      {token.balance}
                    </Button>
                  </Box>
                ))}
            </Box>
            <Button
              onClick={handleOpenAddTokenModal}
              sx={{ mt: 2, mb: 2 }}
              variant="outlined"
              color="primary"
            >
              Import a Token
            </Button>
          </CustomTabPanel>
          <CustomTabPanel value={tabValue} index={1}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {NFTs.filter(
                (nft) => nft.network === selectedNetwork.network
              ).map((nft, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 1,
                    bgcolor: "rgba(255, 255, 255, 0.25)",
                    borderRadius: "4px",
                    boxShadow: 1,
                  }}
                  onClick={() => navigate("/SendNFT", { state: { nft } })}
                >
                  <NFTImage tokenURI={nft.tokenURI} />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: "bold", mt: 1 }}
                  >
                    {nft.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Token ID: {nft.tokenId}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Button
              onClick={handleOpenAddNFTModal}
              sx={{ mt: 2, mb: 2 }}
              variant="outlined"
              color="primary"
            >
              Import an NFT
            </Button>
          </CustomTabPanel>
          <CustomTabPanel
            value={tabValue}
            sx={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
            index={2}
          >
            <Box sx={{ width: "100%" }}>
              <List sx={{ width: "100%" }}>
                {transactions[wallet]?.map((tx, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Hash: ${tx.hash}`}
                      secondary={`Block: ${
                        tx.blockNumber
                      } - Amount: ${ethers.formatEther(tx.value)} ETH`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </CustomTabPanel>
        </Container>
      </Box>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation>
          <BottomNavigationAction
            label="Settings"
            icon={<SettingsOutlined />}
            onClick={() => navigate("/Settings")}
          />
          <BottomNavigationAction
            label="Networks"
            icon={<LanguageOutlined />}
            onClick={() => navigate("/Networks")}
          />
          <BottomNavigationAction
            label="Logout"
            icon={<ExitToAppOutlined />}
            onClick={logout}
          />
        </BottomNavigation>
      </Paper>
      <AddTokenModal
        open={isAddTokenModalOpen}
        handleClose={handleCloseAddTokenModal}
      />
      <AddNFTModal
        open={isAddNFTModalOpen}
        handleClose={handleCloseAddNFTModal}
      />
    </>
  );
};

export default Dashboard;
