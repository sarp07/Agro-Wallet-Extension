import React, { useState, useContext } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { WalletContext } from '../context/WalletContext';
import { useNavigate } from 'react-router-dom';

const AddNetwork = () => {
  const navigate = useNavigate();
  const { addCustomNetwork } = useContext(WalletContext);
  const [networkName, setNetworkName] = useState('');
  const [rpcUrl, setRpcUrl] = useState('');
  const [chainId, setChainId] = useState('');
  const [currencySymbol, setCurrencySymbol] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    addCustomNetwork({ name: networkName, rpcUrl, chainId, currencySymbol });
    setNetworkName('');
    setRpcUrl('');
    setChainId('');
    setCurrencySymbol('');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: 1,
        padding: 3,
        background: 'linear-gradient(135deg, rgba(0,0,0,0.5), rgba(0,128,0,0.5))',
        borderRadius: 2,
        color: 'white',
      }}
    >
      <Typography variant="h6" sx={{ color: 'white', textAlign: 'center', marginBottom: 3 }}>
        Add a New Network
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        label="Network Name"
        value={networkName}
        onChange={(e) => setNetworkName(e.target.value)}
        InputLabelProps={{ style: { color: 'white' } }}
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
      <TextField
        margin="normal"
        required
        fullWidth
        label="Chain ID"
        value={chainId}
        onChange={(e) => setChainId(e.target.value)}
        InputLabelProps={{ style: { color: 'white' } }}
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
      <TextField
        margin="normal"
        required
        fullWidth
        label="Currency Symbol"
        value={currencySymbol}
        onChange={(e) => setCurrencySymbol(e.target.value)}
        InputLabelProps={{ style: { color: 'white' } }}
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
      <TextField
        margin="normal"
        required
        fullWidth
        label="RPC URL"
        value={rpcUrl}
        onChange={(e) => setRpcUrl(e.target.value)}
        InputLabelProps={{ style: { color: 'white' } }}
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
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2, bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' } }}
      >
        Add Network
      </Button>
      <Button
            onClick={() => navigate("/Networks")}
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
    </Box>
  );
};

export default AddNetwork;
