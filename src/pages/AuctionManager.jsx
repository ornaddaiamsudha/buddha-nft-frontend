import React, { useState } from "react";
import { createEnglishAuction, createLuckyBidAuction } from "../utils/contractConfig";

const AuctionManager = () => {
  const [tokenId, setTokenId] = useState("");
  const [duration, setDuration] = useState("");
  const [type, setType] = useState("English");

  const handleCreate = async () => {
    const seconds = parseInt(duration) * 60 * 60;
    if (type === "English") {
      await createEnglishAuction(tokenId, seconds);
    } else {
      await createLuckyBidAuction(tokenId, seconds);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Create New Auction</h2>
      <input
        className="w-full p-2 border rounded mb-2"
        placeholder="Token ID"
        onChange={(e) => setTokenId(e.target.value)}
      />
      <input
        className="w-full p-2 border rounded mb-2"
        placeholder="Duration (hours)"
        onChange={(e) => setDuration(e.target.value)}
      />
      <select
        className="w-full p-2 border rounded mb-4"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="English">English</option>
        <option value="LuckyBid">LuckyBid</option>
      </select>
      <button
        onClick={handleCreate}
        className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
      >
        Create Auction
      </button>
    </div>
  );
};

export default AuctionManager;
