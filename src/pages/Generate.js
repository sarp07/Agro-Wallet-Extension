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
  }, [wallet, handleCreateWallet]);

  useEffect(() => {
    if (mnemonicPhrase) {
      console.log("Mnemonic Phrase:", mnemonicPhrase);
    } else {
      console.error("Mnemonic Phrase is undefined");
    }
  }, [mnemonicPhrase]);

  const handleCopyAddress = () => {
    if (mnemonicPhrase) {
      navigator.clipboard.writeText(mnemonicPhrase)
        .then(() => {
          setAlertMessage("Mnemonic phrase copied!");
          setAlertType("success");
        })
        .catch((error) => {
          console.error("Error copying mnemonic phrase:", error);
          setAlertMessage("Oops! Something went wrong.");
          setAlertType("error");
        })
        .finally(() => {
          setTimeout(() => {
            setAlertMessage("");
            setAlertType("");
          }, 1200);
        });
    }
  };

  const words = mnemonicPhrase ? mnemonicPhrase.split(" ") : [];

  return (
    <Box
      sx={{
        padding: "20px",
        maxWidth: "500px",
        margin: "auto",
        textAlign: "center",
        position: "relative",
        height: "100%",
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: "20px" }}>
        Backup Phrase
      </Typography>
      <Typography sx={{ marginBottom: "20px" }}>
        Once you generate the seed phrase, save it securely in order to recover your wallet in the future.
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {words.map((word, index) => (
          <Grid item xs={4} sm={4} md={3} key={index}>
            <Paper
              elevation={3}
              sx={{
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
            sx={{ color: "#fff" }}
          />
        }
        label="I have saved my backup phrase securely."
        sx={{ marginBottom: "20px", marginTop: "20px" }}
      />

      <Button
        variant="contained"
        color="success"
        disabled={!isConfirmed}
        sx={{ marginBottom: "10px", width: "100%" }}
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
  );
};

export default Generate;
