import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  CircularProgress,
  Modal,
  Backdrop,
  useTheme,
} from "@mui/material";
import { WalletContext } from "../context/WalletContext";
import { useNavigate } from "react-router-dom";

const StakePage = () => {
  const navigate = useNavigate();
  const {
    wallet,
    sendNativeToken,
    networks,
    setAlertMessage,
    setAlertType,
    selectedNetwork,
    balance,
    contract,
  } = useContext(WalletContext);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [stakedAmount, setStakedAmount] = useState(0);
  const [rewards, setRewards] = useState(0);

  useEffect(() => {
    if (wallet) {
      loadStakingDetails();
    }
  }, [wallet]);

  const loadStakingDetails = async () => {
    setLoading(true);
    try {
      const staked = await contract.methods.staked(wallet).call();
      const reward = await contract.methods
        .calculateRewardByAddress(wallet)
        .call();
      setStakedAmount(staked);
      setRewards(reward);
    } catch (error) {
      console.error("Failed to fetch staking details:", error);
    }
    setLoading(false);
  };

  const networkInfo = networks[selectedNetwork.category]?.find(
    (net) => net.name === selectedNetwork?.network
  ) || {
    name: "No network",
    currencySymbol: "N/A",
  };

  const handleStake = async () => {
    if (!amount) {
      setAlertMessage("Please enter an amount to stake.");
      setAlertType("info");
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
        return;
      }, 2200);
    }
    setLoading(true);
    try {
      await contract.methods.stake(amount).send({ from: wallet });
      setAlertMessage(`Staked ${amount} tokens successfully!`);
      setAlertType("success");
      loadStakingDetails();
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
        navigate("/Dashboard");
      }, 2200);
    } catch (error) {
      console.error("Failed to stake tokens:", error);
      setAlertMessage("Failed to stake tokens. See console for details.");
      setAlertType('error');
      setTimeout(() => {
        setAlertMessage('');
        setAlertType('');
      }, 2200);
    }
    setLoading(false);
  };

  const handleUnstake = async () => {
    setLoading(true);
    try {
      await contract.methods.unstake().send({ from: wallet });
      setAlertMessage("Unstaked successfully!");
      setAlertType('success');
      loadStakingDetails();
      setTimeout(() => {
        setAlertMessage('');
        setAlertType('');
      }, 2200);
    } catch (error) {
      console.error("Failed to unstake tokens:", error);
      setAlertMessage("Failed to unstake tokens. See console for details.");
      setAlertType('error');
      setTimeout(() => {
        setAlertMessage('');
        setAlertType('');
      }, 2200);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Modal open={loading} BackdropComponent={Backdrop} BackdropProps={{ timeout: 500, style: { backgroundColor: 'rgba(255, 255, 255, 0.8)' } }}>
        <CircularProgress size={68} style={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-34px', marginLeft: '-34px' }} />
      </Modal>
    );
  }

  const theme = useTheme();

    const styles = {
        box: {
            p: 5,
            gap: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
            color: theme.palette.text.primary,
            boxShadow: theme.shadows[7],
            maxWidth: 400,
            mx: 'auto', 
            my: 'auto',
        },
        input: {
            '& input': { color: 'white' },
            '& label.Mui-focused': { color: 'white' },
            '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' },
            },
            '& .MuiFormHelperText-root': { color: 'white' },
            label: { color: 'white' },
            marginBottom: 2,
        },
        button: {
            mb: 1,
            width: '100%',
            '&:hover': {
                transform: 'scale(1.05)',
            }
        }
    };

    return (
        <Box sx={styles.box}>
            <Typography variant="h5" sx={{ mb: 2, color: 'white' }}>
                Stake Your Balance
            </Typography>
            <Typography sx={{ mb: 1, color: 'white' }}>
                Balance: {balance}
            </Typography>
            <TextField
                label="Amount to Stake"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                sx={styles.input}
            />
            <Button variant="contained" color="success" onClick={handleStake} sx={styles.button}>
                Stake
            </Button>
            <Button variant="contained" color="error" onClick={handleUnstake} sx={styles.button}>
                Unstake
            </Button>
            <Typography sx={{ mt: 2, color: 'white' }}>
                Staked: {stakedAmount} {networkInfo.currencySymbol}
            </Typography>
            <Typography sx={{color: 'white'}}>
                Rewards: {rewards} {networkInfo.currencySymbol}
            </Typography>
            <Grid item>
          <Button
            onClick={() => navigate("/")}
            sx={{
              mt: 2,
              color: "white",
              borderColor: "white",
              "&:hover": { borderColor: "gray" },
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            Back
          </Button>
        </Grid>
        </Box>
    );
};

export default StakePage;
