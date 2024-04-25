import React, { useState, useContext, useEffect } from "react";
import {
  TextField,
  Typography,
  Container,
  Grid,
  Button,
  Alert,
  AlertTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../context/WalletContext";

const Recover = () => {
  const { recoverWallet, alertMessage, alertType, setAlertMessage, wallet} =
    useContext(WalletContext);
  const [mnemonic, setMnemonic] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    if (wallet) {
      navigate('/Dashboard');
    };
  }, [wallet, navigate]);

  const handleRecover = () => {
    recoverWallet(mnemonic, password, confirmPassword);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 h-full">
      {alertMessage && (
        <Container
          maxWidth="sm"
          style={{ position: "absolute", top: "20px", zIndex: 1000 }}
        >
          <Alert
            severity={alertType}
            onClose={() => setAlertMessage("")}
            className="mt-2"
          >
            <AlertTitle>
              {alertType === "warning" ? "Warning" : "Success"}
            </AlertTitle>
            {alertMessage}
          </Alert>
        </Container>
      )}
      <img
        src="assets/images/whitelogo.png"
        alt="Wallet Logo"
        className="w-32 h-32"
      />
      <Grid container spacing={2} marginTop={"30px"} direction="column">
        <Grid item>
          <TextField
            label="Mnemonic Phrase"
            variant="outlined"
            fullWidth
            value={mnemonic}
            onChange={(e) => setMnemonic(e.target.value)}
            helperText="Enter your 12-word mnemonic phrase."
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
        </Grid>
        <Grid item>
          <TextField
            label="New Password"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Set a strong password to secure your wallet."
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
        </Grid>
        <Grid item>
          <TextField
            label="Confirm Password"
            variant="outlined"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            helperText="Confirm your password."
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
        </Grid>
        <Grid item>
        <Button
            onClick={handleRecover}
            variant="contained"
            fullWidth
            sx={{
              mb: 2,
              backgroundColor: "green",
              color: "lightgreen",
              "&:hover": { backgroundColor: "darkgreen" },
            }}
          >
            Confirm
          </Button>
        </Grid>
      </Grid>
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
    </div>
  );
};

export default Recover;
