import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  FormControlLabel,
  Checkbox,
  Grid,
  Paper,
  Button,
  Box,
} from "@mui/material";
import { WalletContext } from "../context/WalletContext";

const Generate = () => {
  const {
    handleCreateWallet,
    wallet,
    mnemonicPhrase,
    setAlertMessage,
    setAlertType,
  } = useContext(WalletContext);

  const [isConfirmed, setIsConfirmed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!wallet) {
      handleCreateWallet();
    }
  }, []);

  const handleCopyAddress = () => {
    try {
      navigator.clipboard.writeText(mnemonicPhrase);
      setAlertMessage("Mnemonic phrase copied!");
      setAlertType("success");
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 1200);
    } catch (error) {
      setAlertMessage("Uups! Something goes wrong.");
      setAlertType("error");
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 1200);
    }
  };

  const words = mnemonicPhrase.split(" ");

  const cardContentStyle = isConfirmed
    ? {}
    : { filter: "blur(4px)", pointerEvents: "none" };

  return (
    <>
      <Box
        style={{
          padding: "20px",
          maxWidth: "500px",
          margin: "auto",
          textAlign: "center",
          position: "relative",
          height: "full",
        }}
      >
        <Typography variant="h5" style={{ marginBottom: "20px" }}>
          Backup Phrase
        </Typography>
        <Typography style={{ marginBottom: "20px" }}>
          Once you generate the seed phrase, save it securely in order to
          recover your wallet in the future.
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {words.map((word, index) => (
            <Grid item xs={4} sm={4} md={3} key={index}>
              <Paper
                elevation={3}
                style={{
                  padding: "10px",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={handleCopyAddress}
              >
                {word}
              </Paper>
            </Grid>
          ))}
        </Grid>

        <FormControlLabel
          control={
            <Checkbox
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              style={{ color: "#fff" }}
            />
          }
          label="I have saved my backup phrase securely."
          style={{ marginBottom: "20px", marginTop: '20px' }}
        />

        <Button
          variant="contained"
          color="success"
          disabled={!isConfirmed}
          style={{ marginBottom: "10px", width: "100%", }}
          onClick={() => navigate("/ApprovePhrase")}
        >
          Open Your New Wallet
        </Button>
        <Button
          onClick={() => navigate("/")}
          sx={{
            mt: 2,
            color: "white",
            borderColor: "white",
            "&:hover": { borderColor: "gray" },
            position: "absolute",
            bottom: -60,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          Back Home
        </Button>
      </Box>
    </>
  );
};

export default Generate;
