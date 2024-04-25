import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
} from "@mui/material";
import { WalletContext } from "../context/WalletContext";

const Generate = () => {
  const { handleCreateWallet, wallet, mnemonicPhrase } = useContext(WalletContext);

  const [isConfirmed, setIsConfirmed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!wallet) {
      handleCreateWallet();
    }
  }, []);

  const cardContentStyle = isConfirmed
    ? {}
    : { filter: "blur(4px)", pointerEvents: "none" };

  return (
    <>
      <Box
        style={{
          padding: "20px",
          maxWidth: "500px",
          margin: "auto",
          textAlign: "center",
          position: "relative",
          height: 'full',
        }}
      >
        <Typography variant="h5" style={{ marginBottom: "20px" }}>
          Backup Phrase
        </Typography>
        <Typography style={{ marginBottom: "20px" }}>
          Once you generate the seed phrase, save it securely in order to
          recover your wallet in the future.
        </Typography>

        <Card variant="outlined" style={{ marginBottom: "20px" }}>
          <CardContent style={{ padding: "20px", ...cardContentStyle }}>
            <Typography
              variant="body1"
              component="p"
              style={{
                fontSize: "1rem",
                wordBreak: "break-all",
                whiteSpace: "pre-wrap",
              }}
            >
              {mnemonicPhrase}
            </Typography>
          </CardContent>
        </Card>

        <FormControlLabel
          control={
            <Checkbox
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              style={{color: '#fff'}}
            />
          }
          label="I have saved my backup phrase securely."
          style={{ marginBottom: "20px" }}
        />

        <Button
          variant="contained"
          color="success"
          disabled={!isConfirmed}
          style={{ marginBottom: "10px", width: "100%" }}
          onClick={() => navigate('/Dashboard')}
        >
          Open Your New Wallet
        </Button>
        <Button
        onClick={() => navigate('/')}
        sx={{
          mt: 2,
          color: 'white',
          borderColor: 'white',
          '&:hover': { borderColor: 'gray' },
          position: 'absolute',
          bottom: -60,
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      >
        Back Home
      </Button>
      </Box>
    </>
  );
};

export default Generate;
