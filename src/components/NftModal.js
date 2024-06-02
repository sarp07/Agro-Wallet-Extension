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

const AddNFTModal = ({ open, handleClose }) => {
  const [nftAddress, setNFTAddress] = useState('');
  const [tokenId, setTokenId] = useState('');
  const { addNFT } = useContext(WalletContext);

  const handleAddNFT = async () => {
    await addNFT(nftAddress, tokenId);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2">
          Import An NFT
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Please enter the NFT contract address and token ID. Make sure it's a trusted source.
        </Typography>
        <TextField
          fullWidth
          label="NFT Contract Address"
          value={nftAddress}
          onChange={(e) => setNFTAddress(e.target.value)}
          margin="normal"
          sx={{
            input: { color: "white" },
            "& label.Mui-focused": { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" },
              "&:hover fieldset": { borderColor: "white" },
              "&.Mui-focused fieldset": { borderColor: "white" },
            },
            label: { color: "lightgray" }
          }}
        />
        <TextField
          fullWidth
          label="Token ID"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          margin="normal"
          sx={{
            input: { color: "white" },
            "& label.Mui-focused": { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" },
              "&:hover fieldset": { borderColor: "white" },
              "&.Mui-focused fieldset": { borderColor: "white" },
            },
            label: { color: "lightgray" }
          }}
        />
        <Button
          variant="contained"
          onClick={handleAddNFT}
          fullWidth
          sx={{
            mt: 2,
            mb: 2,
            backgroundColor: "green",
            color: "lightgreen",
            "&:hover": { backgroundColor: "darkgreen" },
          }}
        >
          Add NFT
        </Button>
      </Box>
    </Modal>
  );
};

export default AddNFTModal;
