import React from 'react';
import { Box, Button, Card, List, ListItem, ListItemText, Typography } from '@mui/material';

// CheckApprovePage component
const CheckApprovePage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundImage: 'url(background-image.jpg)',
        backgroundSize: 'cover',
      }}
    >
      <Card sx={{ p: 3, width: '100%', maxWidth: '400px', backgroundColor: 'paper' }}>
        <Typography variant="h5" gutterBottom>
          İşlemi Onayla
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Alıcı:" secondary="0x...123" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Miktar:" secondary="0.5 BNB" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Gaz Ücreti:" secondary="0.01 BNB" />
          </ListItem>
        </List>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="outlined" color="secondary">
            İptal
          </Button>
          <Button variant="contained" color="primary">
            Onayla
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default CheckApprovePage;
