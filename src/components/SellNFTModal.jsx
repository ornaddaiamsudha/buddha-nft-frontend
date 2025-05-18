// frontend/src/components/SellNFTModal.jsx
import React, { useState } from "react";

const SellNFTModal = ({ tokenId, onSell, onClose }) => {
  const [price, setPrice] = useState("");

  const handleSubmit = () => {
    onSell(tokenId, price);
    onClose();
  };

  return (
    <div className="bg-white border p-4 rounded shadow-md fixed top-1/3 left-1/3 z-50">
      <h2 className="text-lg font-semibold mb-2">Sell NFT #{tokenId}</h2>
      <input
        type="number"
        placeholder="Price in ETH"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="border px-2 py-1 w-full mb-3"
      />
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-3 py-1 rounded mr-2">
        Confirm
      </button>
      <button onClick={onClose} className="bg-gray-300 px-3 py-1 rounded">
        Cancel
      </button>
    </div>
  );
};

export default SellNFTModal;
