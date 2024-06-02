import React, { useState, useEffect, useContext } from "react";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../context/WalletContext";
import { ethers } from "ethers";
import ConfirmTransaction from '../components/checkTransactionModal';

const SendPage = () => {
  const { gasPrice, calculateMaxAmount, maxAmount, selectedNetwork, networks } = useContext(WalletContext);
  const navigate = useNavigate();
  const [reciepentAddress, setReciepentAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);


   useEffect(() => {
     setIsValidAddress(ethers.isAddress(reciepentAddress));
   }, [reciepentAddress]);

  const handleRecipientAddressChange = (event) => {
    setReciepentAddress(event.target.value);
    setIsTouched(true);
  };

  const showError = isTouched && reciepentAddress && !isValidAddress;

  const handleMax = async () => {
    await calculateMaxAmount();
    setAmount(maxAmount);
  };

  const handleNext = () => {
    setOpenConfirmModal(true);
  };

  const handleCloseModal = () => {
    setOpenConfirmModal(false);
  };

  const totalCost = parseFloat(amount) + parseFloat(gasPrice);

  const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState('');

    useEffect(() => {
      if (selectedNetwork && networks[selectedNetwork.category]) {
        const networkConfig = networks[selectedNetwork.category].find(
          (net) => net.name === selectedNetwork.network
        );
        if (networkConfig && networkConfig.currencySymbol) {
          setSelectedCurrencySymbol(networkConfig.currencySymbol);
        }
      }
    }, [selectedNetwork]);

  return (
    <>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card
        sx={{
          p: 3,
          width: "100%",
          maxWidth: "400px",
          height: "100%",
          background: "none",
        }}
      >
        <Typography
          variant="h5"
          color={"white"}
          sx={{
            display: "flex",
            top: "0",
            justifyContent: "center",
          }}
          gutterBottom
        >
          {!isValidAddress ? "Send to:" : "SEND"}
        </Typography>
        {!isValidAddress && (
          <Typography
            variant="h5"
            color={"white"}
            sx={{
              display: "flex",
              position: "absolute",
              top: "30px",
              right: "10px",
              color: "red",
              cursor: "pointer",
              fontSize: "18px",
              justifyContent: "center",
            }}
            onClick={() => navigate("/Dashboard")}
            gutterBottom
          >
            cancel
          </Typography>
        )}

        <TextField
          label="recipient address..."
          variant="outlined"
          value={reciepentAddress}
          onChange={handleRecipientAddressChange}
          error={showError}
          helperText={showError ? "Recipient address is invalid!" : " "}
          fullWidth
          sx={{
            mt: 5,
            input: { color: "white" },
            "& label.Mui-focused": { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" },
              "&:hover fieldset": { borderColor: "white" },
              "&.Mui-focused fieldset": { borderColor: "white" },
            },
            "& .MuiFormHelperText-root": { color: "white" },
            label: { color: "lightgray" },
          }}
          margin="normal"
        />
        {isValidAddress && (
          <>
            <Box sx={{ display: "flex", mt: 5, alignItems: "center" }}>
              <TextField
                label="Amount"
                variant="outlined"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                fullWidth
                margin="normal"
                sx={{
                  input: { color: "white" },
                  "& label.Mui-focused": { color: "white" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "white" },
                    "&:hover fieldset": { borderColor: "white" },
                    "&.Mui-focused fieldset": { borderColor: "white" },
                  },
                  "& .MuiFormHelperText-root": { color: "white" },
                  label: { color: "lightgray" },
                }}
              />
              <Button
                variant="outlined"
                onClick={handleMax}
                color="success"
                sx={{
                  ml: 2,
                  color: "success",
                  borderRadius: 5,
                  fontSize: "12px",
                  px: 2,
                }}
              >
                Maksimum
              </Button>
            </Box>
            <Typography variant="body2" color={"lightgray"} sx={{ mt: 5 }}>
              Estimate Fee: {gasPrice} {selectedCurrencySymbol}
            </Typography>
            <Box
              sx={{
                display: "flex",
                mt: 5,
                flexDirection: "row",
              }}
            >
              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={() => navigate('/Dashboard')}
                sx={{ mt: 2, mx: 1, p: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                fullWidth
                onClick={handleNext}
                sx={{ mt: 2, mx: 1, p: 1 }}
              >
                Next
              </Button>
            </Box>
          </>
        )}
      </Card>
    </Box>
    <ConfirmTransaction
        open={openConfirmModal}
        handleClose={handleCloseModal}
        recipientAddress={reciepentAddress}
        amount={amount}
        gasPrice={gasPrice}
        total={totalCost} // Assuming gasPrice and amount are strings, hence parseFloat
      />
    </>
  );
};

export default SendPage;
