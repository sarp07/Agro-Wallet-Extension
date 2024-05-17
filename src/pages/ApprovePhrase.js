import React, { useState, useContext } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { WalletContext } from "../context/WalletContext";
import { useNavigate } from "react-router-dom";

const ApprovePhrase = () => {
  const [mnemonics, setMnemonics] = useState(Array(12).fill(""));
  const {
    verifyMnemonic,
    setAlertMessage,
    setAlertType,
  } = useContext(WalletContext);
  const navigate = useNavigate();

  const handleControlPhrase = () => {
    const isAllFilled = mnemonics.every((mnemonic) => mnemonic.trim() !== "");

    if (!isAllFilled) {
      setAlertMessage("Mnemonic Phrases is empty!");
      setAlertType("error");
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 1200);
      return;
    } else {
      verifyMnemonic(mnemonics.join(" "));
    }
  };

  const handlePasteMnemonic = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        const words = text.split(" ");
        if (words.length === 12) {
          setMnemonics(words);
        } else {
          setAlertMessage("Oops! Something goes wrong.");
          setAlertType("error");
          setTimeout(() => {
            setAlertMessage("");
            setAlertType("");
          }, 1200);
        }
      } else {
        setAlertMessage("Clipboard is empty.");
        setAlertType("error");
        setTimeout(() => {
          setAlertMessage("");
          setAlertType("");
        }, 1200);
      }
    } catch (error) {
      console.error("Error reading from clipboard:", error);
      setAlertMessage("Failed to read from clipboard.");
      setAlertType("error");
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 1200);
    }
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        padding: "20px",
        maxWidth: "500px",
        margin: "auto",
        textAlign: "center",
        position: "relative",
        height: "full",
      }}
    >
      <Box
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: 1,
          borderRadius: 1,
          p: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 2, color: "text.primary" }}
          style={{ color: "#fff" }}
        >
          Confirm Your Mnemonic Phrase
        </Typography>
        <Grid container spacing={2}>
          {mnemonics.map((mnemonic, index) => (
            <Grid style={{ gap: "10px" }} item xs={4} sm={4} key={index}>
              <TextField
                label={`Ph: ${index + 1}`}
                value={mnemonics[index]}
                onChange={(e) => {
                  const newMnemonics = [...mnemonics];
                  newMnemonics[index] = e.target.value;
                  setMnemonics(newMnemonics);
                }}
                variant="outlined"
                InputProps={{
                  style: {
                    color: "white",
                    borderColor: "white",
                  },
                }}
                InputLabelProps={{
                  style: {
                    color: "white",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "white" },
                    "&:hover fieldset": { borderColor: "white" },
                    "&.Mui-focused fieldset": { borderColor: "white" },
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>
        <IconButton
          onClick={handlePasteMnemonic}
          color="primary"
          sx={{
            color: "white",
            borderColor: "white",
            "&:hover": { borderColor: "gray" },
            marginTop: "20px",
          }}
        >
          <ContentPasteIcon />
          <Typography sx={{ ml: 1, display: { xs: "none", sm: "block" } }}>
            Paste
          </Typography>
        </IconButton>
        <Button
          onClick={handleControlPhrase}
          variant="contained"
          color="success"
          sx={{ mt: 2 }}
          fullWidth
        >
          Confirm Phrase
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
    </Container>
  );
};

export default ApprovePhrase;
