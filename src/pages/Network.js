import React, { useContext, useState } from "react";
import { Box, Button, Tabs, Tab, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../context/WalletContext";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`network-tabpanel-${index}`}
      aria-labelledby={`network-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `network-tab-${index}`,
    "aria-controls": `network-tabpanel-${index}`,
  };
}

const Network = () => {
  const { setSelectedNetworkConfig, networks, refreshBalance } = useContext(WalletContext);
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNetworkSelect = (category, networkName) => {
    setSelectedNetworkConfig(category, networkName);
    refreshBalance();
    navigate("/dashboard");
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={tabValue}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
      >
        {Object.keys(networks).map((category, index) => (
          <Tab
            key={category}
            sx={{
              color: "white",
            }}
            label={category.toUpperCase()}
            {...a11yProps(index)}
          />
        ))}
      </Tabs>
      <Divider />
      {Object.entries(networks).map(([category, networkArray], index) => (
        <TabPanel value={tabValue} index={index} key={category}>
          {networkArray.map((network, idx) => (
            <Button
              key={idx}
              onClick={() => handleNetworkSelect(category, network.name)}
              sx={{ mt: 1, mb: 1, color: "white" }}
            >
              {network.name}
            </Button>
          ))}
        </TabPanel>
      ))}
      <Tab
        key="add-network"
        label="ADD NETWORK"
        onClick={() => navigate("/AddNetwork")}
      />
      <Button
        onClick={() => navigate("/dashboard")}
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

export default Network;
