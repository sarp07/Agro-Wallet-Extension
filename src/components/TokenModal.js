import React, { useState, useContext } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { WalletContext } from '../context/WalletContext';

const modalStyle = {
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  top: '50%',
  left: '50%',
  color: '#fff',
  width: '300px',
  transform: 'translate(-50%, -50%)',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  background: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(20px)',
};

const AddTokenModal = ({ open, handleClose }) => {
  const [tokenAddress, setTokenAddress] = useState('');
  const { addToken } = useContext(WalletContext);

  const handleAddToken = async () => {
    await addToken(tokenAddress);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2">
          Import A Token
        </Typography>
        <Typography sx={{ mt: 2 }}>
        Token detection is not yet available on this network. Please import the token manually and make sure you trust it.
        </Typography>
        <TextField
          fullWidth
          label="Token Contract Address"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
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
          variant="contained"
          onClick={handleAddToken}
            fullWidth
            sx={{
              mt: 2,
              mb: 2,
              backgroundColor: "green",
              color: "lightgreen",
              "&:hover": { backgroundColor: "darkgreen" },
            }}
        >
          Add Token
        </Button>
      </Box>
    </Modal>
  );
};

export default AddTokenModal;
