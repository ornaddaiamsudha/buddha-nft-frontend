import React, { useEffect, useState } from "react";
import { getLuckyBids, bidLucky, endLucky } from "../utils/contractConfig";

const LuckyBidAuction = () => {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getLuckyBids();
      setAuctions(data);
    })();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Lucky Bid Auctions</h2>
      {auctions.map((auction) => (
        <div key={auction.address} className="border rounded-lg p-4 mb-6">
          <img src={auction.metadata.images?.[0]} alt="NFT" className="h-48 w-full object-cover rounded mb-2" />
          <h3 className="text-lg font-semibold">{auction.metadata.name}</h3>
          <input
            type="number"
            placeholder="Your bid"
            className="w-full p-2 border mt-2 mb-2 rounded"
            onChange={(e) => (auction.userBid = e.target.value)}
          />
          <div className="flex gap-2">
            <button onClick={() => bidLucky(auction.address, auction.userBid)} className="flex-1 bg-yellow-500 text-white py-2 rounded">
              Enter Lucky Bid
            </button>
            <button onClick={() => endLucky(auction.address)} className="flex-1 bg-red-500 text-white py-2 rounded">
              End Auction
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LuckyBidAuction;