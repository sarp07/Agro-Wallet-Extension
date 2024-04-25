import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { WalletContext } from "../context/WalletContext";
import { TextField, Button, Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const SendToken = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sendToken } = useContext(WalletContext);
  const { token } = location.state;
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");

  const handleSendToken = async () => {
    
    try {
      await sendToken(toAddress, amount, token.address);
      alert("Token başarıyla gönderildi!");
    } catch (error) {
      alert("Token gönderimi sırasında hata oluştu: " + error.message);
    }
  };

  return (
    <Box sx={{ padding: 2, borderRadius: 1 }}>
      <IconButton onClick={() => navigate("/Dashboard")}>
        <ArrowBackIcon style={{color: '#fff'}} />
      </IconButton>
      <Typography variant="h6" sx={{ my: 2 }}>
        {`${token.symbol} Gönder`}
      </Typography>
      <Typography variant="body2">
        Bakiye: {token.balance} {token.symbol}
      </Typography>
      <TextField
        label="Reciever Address"
        variant="outlined"
        fullWidth
        margin="normal"
        value={toAddress}
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
        onChange={(e) => setToAddress(e.target.value)}
      />
      <TextField
        label="Amount"
        variant="outlined"
        fullWidth
        margin="normal"
        type="number"
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
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button
        variant="contained"
        onClick={handleSendToken}
        sx={{
          mt: 2,
          mb: 2,
          backgroundColor: "green",
          color: "lightgreen",
          "&:hover": { backgroundColor: "darkgreen" },
        }}
      >
        Sende
      </Button>
    </Box>
  );
};

export default SendToken;
