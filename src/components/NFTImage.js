import React from 'react';
import { Box, Typography, Image } from '@mui/material';

const NFTImage = ({ tokenURI }) => {
  // IPFS URL'ini HTTP URL'ine çevirme
  const formatIPFS = (uri) => {
    if (uri.startsWith('ipfs://')) {
      return `https://ipfs.io/ipfs/${uri.split('ipfs://')[1]}`;
    }
    return uri; // Eğer zaten http URL ise değişiklik yapma
  };

  return (
    <Box>
      <Typography variant="h6">NFT Image</Typography>
      <img src={formatIPFS(tokenURI)} alt="NFT" style={{ maxWidth: '100%' }} />
    </Box>
  );
};

export default NFTImage;
