import React, { useState, useContext } from "react";
import { WalletContext } from "../context/WalletContext";
import {
  TextField,
  Button,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const {
    setAlertMessage,
    setAlertType,
    updatePassword,
    mnemonicPhrase,
    privKey,
  } = useContext(WalletContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [acceptedRisk, setAcceptedRisk] = useState(false);
  const [acceptedRisk2, setAcceptedRisk2] = useState(false);

  const handlePasswordChange = async () => {
    if (confirmNewPassword !== newPassword) {
      setAlertMessage("Both password fields must be filled!");
      setAlertType("warning");
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 2200);
    } else if (currentPassword === newPassword) {
      setAlertMessage("New password and current password be not same!");
      setAlertType("warning");
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 2200);
    }
    try {
      await updatePassword(currentPassword, newPassword);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAcceptedRiskChange = (riskType) => (event) => {
    if (riskType === 'privateKey') {
      setAcceptedRisk(event.target.checked);
    } else if (riskType === 'mnemonic') {
      setAcceptedRisk2(event.target.checked);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Settings
      </Typography>
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Change Password</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            label="Current Password"
            type="password"
            fullWidth
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handlePasswordChange}>
            Change Password
          </Button>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Private Key</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControlLabel
            control={
              <Checkbox
                checked={acceptedRisk}
                onChange={handleAcceptedRiskChange('privateKey')}
              />
            }
            label="I understand the risks of exposing my private key."
          />
          <Button
            variant="outlined"
            onClick={() => setShowPrivateKey(!showPrivateKey)}
            disabled={!acceptedRisk}
          >
            {showPrivateKey ? "Hide Private Key" : "Show Private Key"}
          </Button>
          {showPrivateKey && (
            <Typography sx={{ mt: 2 }}>Private Key: {privKey}</Typography>
          )}
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Mnemonic Phrase</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControlLabel
            control={
              <Checkbox
                checked={acceptedRisk2}
                onChange={handleAcceptedRiskChange('mnemonic')}
              />
            }
            label="I accept the risks of exposing my mnemonic phrase."
          />
          <Button
            variant="outlined"
            onClick={() => setShowMnemonic(!showMnemonic)}
            disabled={!acceptedRisk2}
          >
            {showMnemonic ? "Hide Mnemonic" : "Show Mnemonic"}
          </Button>
          {showMnemonic && (
            <Typography sx={{ mt: 2 }}>Mnemonic: {mnemonicPhrase}</Typography>
          )}
        </AccordionDetails>
      </Accordion>
      <Button
        onClick={() => navigate("/Dashboard")}
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

export default Settings;
