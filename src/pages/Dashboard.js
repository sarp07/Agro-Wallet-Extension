import React, { useContext, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
  TextField,
  Button,
  Tabs,
  Tab,
  Paper,
  Container,
  AppBar,
  Toolbar,
  CssBaseline,
  Grid,
} from "@mui/material";
import {
  SettingsOutlined,
  LanguageOutlined,
  ExitToAppOutlined,
  Refresh as RefreshIcon,
  CopyAllOutlined,
} from "@mui/icons-material";
import { WalletContext } from "../context/WalletContext";
import { useNavigate } from "react-router-dom";
import AddTokenModal from "../components/TokenModal";
import AddNFTModal from "../components/NftModal";
import NFTImage from "../components/NFTImage";

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
    wallet,
    balance,
    refreshBalance,
    sendNativeToken,
    selectedNetwork,
    setAlertMessage,
    networks,
    setAlertType,
    tokens,
    logout,
    calculateMaxAmount,
    maxAmount,
    NFTs,
  } = useContext(WalletContext);
  const navigate = useNavigate();
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [value, setValue] = useState(0);
  const [isAddTokenModalOpen, setAddTokenModalOpen] = useState(false);
  const [isAddNFTModalOpen, setAddNFTModalOpen] = useState(false);

  const networkInfo = networks[selectedNetwork.category]?.find(
    (net) => net.name === selectedNetwork.network
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

  const handleTransfer = async () => {
    try {
      await sendNativeToken(recipientAddress, amount);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenAddTokenModal = () => setAddTokenModalOpen(true);
  const handleCloseAddTokenModal = () => setAddTokenModalOpen(false);

  const handleOpenAddNFTModal = () => setAddNFTModalOpen(true);
  const handleCloseAddNFTModal = () => setAddNFTModalOpen(false);

  const handleSetMaxAmount = async () => {
    setAmount(maxAmount);
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ pb: 2 }}>
        <AppBar
          position="static"
          sx={{ background: "transparent", boxShadow: "none" }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6" noWrap component="div" style={{cursor: 'pointer'}} onClick={() => navigate('/Networks')}>
              {selectedNetwork?.network || "Network Seçilmedi"}
            </Typography>
            <IconButton color="inherit" onClick={refreshBalance}>
              <RefreshIcon />
            </IconButton>
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
              label="Transfer"
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
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": {
                  color: "white",
                  m: "4px",
                  width: "30ch",
                },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                label="Recipient Address"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                fullWidth
                variant="filled"
                sx={{
                  input: { color: "white" },
                  "& .MuiFilledInput-underline:before": {
                    borderBottomColor: "white",
                  },
                  "& .MuiFilledInput-underline:after": {
                    borderBottomColor: "white",
                  },
                  "& .MuiInputLabel-root": { color: "white" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "white" },
                  "& .MuiFilledInput-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.09)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.13)",
                    },
                  },
                }}
              />
              <Grid container spacing={2}>
                <Grid item xs={9}>
                  <TextField
                    label="Amount to Send"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    fullWidth
                    variant="filled"
                    sx={{
                      input: { color: "white" },
                      "& .MuiFilledInput-underline:before": {
                        borderBottomColor: "white",
                      },
                      "& .MuiFilledInput-underline:after": {
                        borderBottomColor: "white",
                      },
                      "& .MuiInputLabel-root": { color: "white" },
                      "& .MuiInputLabel-root.Mui-focused": { color: "white" },
                      "& .MuiFilledInput-root": {
                        backgroundColor: "rgba(255, 255, 255, 0.09)",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.13)",
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Button
                    sx={{
                      mt: 1,
                      backgroundColor: "transparent",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                    }}
                    variant="contained"
                    fullWidth
                    onClick={handleSetMaxAmount}
                  >
                    Add Max
                  </Button>
                </Grid>
              </Grid>
              <Button
                sx={{
                  mt: 2,
                  mb: 2,
                  backgroundColor: "green",
                  color: "lightgreen",
                  "&:hover": {
                    backgroundColor: "darkgreen",
                  },
                }}
                variant="contained"
                fullWidth
                onClick={handleTransfer}
              >
                Transfer
              </Button>
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
