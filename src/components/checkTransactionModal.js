import React, { useContext, useState, useEffect } from "react";
import { Box, Modal, Typography, Button, Card, CircularProgress } from "@mui/material";
import { WalletContext } from "../context/WalletContext";
import { useNavigate } from "react-router-dom";

const cardStyle = {
  backdropFilter: "blur(10px)",
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  borderRadius: "1rem",
  p: "2rem",
  width: "300px",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
};

const ConfirmTransaction = ({
  open,
  handleClose,
  recipientAddress,
  amount,
  gasPrice,
  total,
}) => {
  const navigate = useNavigate();
  const { sendTransaction, selectedNetwork, networks } =
    useContext(WalletContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendTransaction = async () => {
    setIsSubmitting(true);
    try {
      await sendTransaction(recipientAddress, amount);
      setTimeout(() => {
        setIsSubmitting(false);
        handleClose();
        navigate("/Dashboard");
      }, 1200);
    } catch (error) {
      setTimeout(() => {
        handleClose();
      }, 1200);
      setIsSubmitting(false);
    }
  };

  const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState("");

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

  const formattedAddress = recipientAddress
    ? `0x${recipientAddress.slice(2, 6)}...${recipientAddress.slice(-4)}`
    : "No Wallet Address";

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="transaction-confirmation-modal"
      aria-describedby="transaction-confirmation-details"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "300px",
        }}
      >
        <Card sx={cardStyle}>
          <Typography variant="h6" color="white" gutterBottom>
            Confirm Transaction
          </Typography>
          <Typography variant="body1" color="white" sx={{ mt: 2 }}>
            {amount} {selectedCurrencySymbol} to {formattedAddress}
          </Typography>
          <Typography variant="body2" color="white" sx={{ mt: 2 }}>
            Estimated Fee: {gasPrice || "Not available"}{" "}
            {selectedCurrencySymbol}
          </Typography>
          <Typography variant="body2" color="white" sx={{ mt: 2, mb: 3 }}>
            Total: {total} {selectedCurrencySymbol}
          </Typography>
          {isSubmitting ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Button onClick={handleClose} color="error" fullWidth>
                Cancel
              </Button>
              <Button
                onClick={handleSendTransaction}
                color="success"
                fullWidth
                sx={{ mt: 2 }}
              >
                Confirm
              </Button>
            </>
          )}
        </Card>
      </Box>
    </Modal>
  );
};

export default ConfirmTransaction;
