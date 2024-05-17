import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Grid, Box, Typography } from "@mui/material";
import { ethers } from "ethers";

const CreateWallet = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [encryptedJson, setEncryptedJson] = useState(null);
  const navigate = useNavigate();

  const handleCreateWallet = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const randomWallet = ethers.Wallet.createRandom();
      const encryptedJson = await randomWallet.encrypt(password);
      setEncryptedJson(encryptedJson);
      setError("");
    } catch (err) {
      console.error("Error creating wallet:", err);
      setError("Error creating wallet. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        padding: "20px",
        maxWidth: "500px",
        margin: "auto",
        textAlign: "center",
        height: "100%",
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: "20px" }}>
        Create a New Wallet
      </Typography>
      <Grid container spacing={2} direction="column">
        <Grid item>
          <TextField
            type="password"
            label="Password"
            variant="outlined"
            fullWidth
            helperText="Set your strong password!"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            type="password"
            label="Confirm Password"
            variant="outlined"
            fullWidth
            helperText="Confirm your strong password!"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
        {error && (
          <Grid item>
            <Typography color="error">{error}</Typography>
          </Grid>
        )}
        <Grid item>
          <Button
            onClick={handleCreateWallet}
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "green",
              color: "lightgreen",
              "&:hover": { backgroundColor: "darkgreen" },
            }}
          >
            Create Wallet
          </Button>
        </Grid>
        {encryptedJson && (
          <Grid item>
            <Typography variant="body1" sx={{ marginTop: "20px" }}>
              Your encrypted wallet JSON:
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
              {encryptedJson}
            </Typography>
          </Grid>
        )}
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
      </Grid>
    </Box>
  );
};

export default CreateWallet;
