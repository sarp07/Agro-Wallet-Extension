import "./App.css";
import React from "react";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Recover from "./pages/Recover";
import Setting from "./pages/Setting";
import Menu from "./pages/Menu";
import Network from "./pages/Network";
import Generate from "./pages/Generate";
import SendNFT from "./pages/SendNFT";
import SendToken from "./pages/SendToken";
import AddNetwork from "./pages/AddNetwork";
import ImportNFT from "./pages/ImportNFT";
import ImportToken from "./pages/ImportToken";
import Dashboard from "./pages/Dashboard";
import CheckAndApprove from './pages/CheckAndApprove';
import SendPage from './pages/SendPage';
import StakePage from './pages/StakePage';
import ApprovePhrase from "./pages/ApprovePhrase";
import { WalletProvider } from "./context/WalletContext";

const styles = {
  backgroundImage: 'url("/assets/bg/bg.jpg")',
  backgroundRepeat: "no-repeat",
  backgroundPosition: "50% / cover",
};

function App() {

  return (
    <div
      style={styles}
      className="App border-b border-r flex h-screen relative"
    >
      <WalletProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Create" element={<Create />} />
          <Route path="/Recover" element={<Recover />} />
          <Route path="/Menu" element={<Menu />} />
          <Route path="/Settings" element={<Setting />} />
          <Route path="/Networks" element={<Network />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Generate" element={<Generate />} />
          <Route path="/ImportNFT" element={<ImportNFT />} />
          <Route path="/ImportToken" element={<ImportToken />} />
          <Route path="/SendNFT" element={<SendNFT />} />
          <Route path="/SendToken" element={<SendToken />} />
          <Route path="/AddNetwork" element={<AddNetwork />} />
          <Route path="/ApprovePhrase" element={<ApprovePhrase />} />
          <Route path="/SendPage" element={<SendPage />} />
          <Route path="CheckAndApprove" element={<CheckAndApprove />} />
          <Route path="StakePage" element={<StakePage />} />
        </Routes>
      </WalletProvider>
    </div>
  );
}

export default App;
