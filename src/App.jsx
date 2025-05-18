import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Mint from "./pages/Mint";
import Marketplace from "./pages/Marketplace";
import EnglishAuction from "./pages/EnglishAuction";
import LuckyBidAuction from "./pages/LuckyBidAuction";
import AuctionManager from "./pages/AuctionManager";
import MyNFTs from "./pages/MyNFTs";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mint" element={<Mint />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/english" element={<EnglishAuction />} />
          <Route path="/lucky" element={<LuckyBidAuction />} />
          <Route path="/manager" element={<AuctionManager />} />
          <Route path="/my" element={<MyNFTs />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
