import React, { useState } from "react";
import { ethers } from "ethers";
import { uploadToIPFS } from "../utils/ipfs";
import { BUDDHA_NFT_ADDRESS } from "../utils/contractConfig";
import BuddhaNFTArtifact from "../abis/BuddhaNFT.json";

const Mint = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    year: "",
    frame: "Gold Frame",
  });
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setImages(files);
  };

  const handleMint = async () => {
    try {
      if (!form.name || !form.description || !form.year || images.length === 0) {
        setStatus("Please complete all fields and select at least one image.");
        return;
      }

      setStatus("Uploading metadata to IPFS...");
      const metadataURL = await uploadToIPFS(form, images);
      console.log("Token URI:", metadataURL);

      if (!metadataURL || !metadataURL.startsWith("http")) {
        setStatus("Invalid metadata URL.");
        return;
      }

      setStatus("Sending mint transaction...");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();

      const contract = new ethers.Contract(
        BUDDHA_NFT_ADDRESS,
        BuddhaNFTArtifact.abi,
        signer
      );

      const tx = await contract.mint(userAddress, metadataURL);
      await tx.wait();

      setStatus("✅ NFT Minted Successfully!");
    } catch (err) {
      console.error("Mint failed:", err);
      setStatus("❌ Mint failed. See console for details.");
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Mint Your Buddha Amulet</h2>
      
      <input
        className="w-full p-2 mb-2 border rounded"
        placeholder="Amulet Name"
        name="name"
        onChange={handleChange}
      />
      <textarea
        className="w-full p-2 mb-2 border rounded"
        placeholder="Description"
        name="description"
        onChange={handleChange}
      />
      <input
        className="w-full p-2 mb-2 border rounded"
        placeholder="Year"
        name="year"
        onChange={handleChange}
      />
      <select
        className="w-full p-2 mb-2 border rounded"
        name="frame"
        onChange={handleChange}
        value={form.frame}
      >
        <option>Gold Frame</option>
        <option>Silver Frame</option>
        <option>Plastic Frame</option>
      </select>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className="mb-4"
      />

      <button
        onClick={handleMint}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Mint NFT
      </button>

      {status && <p className="text-center mt-2">{status}</p>}
    </div>
  );
};

export default Mint;