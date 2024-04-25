import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { WalletContext } from "../context/WalletContext";
import { TextField, Button, Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NFTImage from "../components/NFTImage";

const SendNFT = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sendNFT } = useContext(WalletContext);
  const { nft } = location.state;
  const [toAddress, setToAddress] = useState("");

  const handleSendNFT = async () => {
    try {
      await sendNFT(nft.address, nft.tokenId, toAddress);
      alert("NFT başarıyla gönderildi!");
    } catch (error) {
      alert("NFT gönderimi sırasında hata oluştu: " + error.message);
    }
  };

  return (
    <Box sx={{ padding: 2, borderRadius: 1, bgcolor: 'transparent' }}>
      <IconButton onClick={() => navigate("/Dashboard")}>
        <ArrowBackIcon style={{ color: '#fff' }} />
      </IconButton>
      <Typography variant="h6" sx={{ my: 2, color: '#fff' }}>
        {`Send ${nft.name}`}
      </Typography>
      <NFTImage tokenURI={nft.tokenURI} />
      <TextField
        label="Receiver Address"
        variant="outlined"
        fullWidth
        margin="normal"
        value={toAddress}
        onChange={(e) => setToAddress(e.target.value)}
        sx={{
          input: { color: "white" },
          "& label.Mui-focused": { color: "white" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "white" },
            "&:hover fieldset": { borderColor: "white" },
            "&.Mui-focused fieldset": { borderColor: "white" },
          },
          label: { color: "lightgray" },
        }}
      />
      <Button
        variant="contained"
        onClick={handleSendNFT}
        sx={{
          mt: 2,
          mb: 2,
          backgroundColor: "green",
          color: "lightgreen",
          "&:hover": { backgroundColor: "darkgreen" },
        }}
      >
        Send NFT
      </Button>
    </Box>
  );
};

export default SendNFT;
