import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Grid,
} from "@mui/material";
import { WalletContext } from '../context/WalletContext';

const Create = () => {
  const { createPassword, wallet, isMnemonicConfirmed } = useContext(WalletContext);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    createPassword(password, confirmPassword);
  };

  useEffect(() => {
    if (!isMnemonicConfirmed) {
      return;
    } else if (wallet) {
      navigate('/Dashboard');
    };
  }, [wallet, isMnemonicConfirmed, navigate]);

  return (
    <div className="flex flex-col items-center justify-center p-4 h-full">
      <img
        src="assets/images/whitelogo.png"
        alt="Wallet Logo"
        className="w-32 h-32"
      />
      <Grid container spacing={2} marginTop={'30px'} direction="column">
        <Grid item>
          <TextField
            type="password"
            label="Password"
            variant="outlined"
            fullWidth
            helperText={"Set your strong password!"}
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
            helperText={"Confirm your strong password!"}
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
        <Grid item>
          <Button
            onClick={handleNext}
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "green",
              color: "lightgreen",
              "&:hover": { backgroundColor: "darkgreen" },
            }}
          >
            Confirm
          </Button>
        </Grid>
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
    </div>
  );
};

export default Create;
