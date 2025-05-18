import React, { useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import { getBuddhaNFT, getMarketplace } from "../utils/contractConfig";
import SellNFTModal from "../components/SellNFTModal";
import { WalletContext } from "../contexts/WalletContext";

const MyNFTs = () => {
  const { account } = useContext(WalletContext);
  const [nfts, setNfts] = useState([]);
  const [marketplace, setMarketplace] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!account) return;
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const buddhaNFT = await getBuddhaNFT(signer);
        const marketplaceContract = await getMarketplace(signer);
        setMarketplace(marketplaceContract);

        console.log("Connected account:", account);

        const balance = await buddhaNFT.balanceOf(account);
        console.log("NFT balance:", balance.toString());

        const nftList = [];

        for (let i = 0; i < balance; i++) {
          const tokenId = await buddhaNFT.tokenOfOwnerByIndex(account, i);
          console.log(`Token #${i}: ${tokenId.toString()}`);

          const uri = await buddhaNFT.tokenURI(tokenId);
          console.log(`Token URI for tokenId ${tokenId}: ${uri}`);

          const response = await fetch(uri.replace("ipfs://", "https://ipfs.io/ipfs/"));
          const metadata = await response.json();
          console.log("Metadata loaded:", metadata);

          nftList.push({ tokenId: tokenId.toString(), metadata });
        }

        setNfts(nftList);
      } catch (error) {
        console.error("Failed to load NFTs or marketplace:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [account]);

  const handleSell = async (tokenId, priceInEth) => {
    try {
      if (!marketplace) {
        alert("Marketplace not loaded.");
        return;
      }
  
      if (!priceInEth || isNaN(priceInEth) || Number(priceInEth) <= 0) {
        alert("Enter a valid price.");
        return;
      }
  
      const priceWei = ethers.utils.parseEther(priceInEth.toString());
  
      // Get NFT contract
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const buddhaNFT = await getBuddhaNFT(signer);
  
      // Check and approve transfer
      const approved = await buddhaNFT.isApprovedForAll(await signer.getAddress(), marketplace.address);
      if (!approved) {
        const approvalTx = await buddhaNFT.setApprovalForAll(marketplace.address, true);
        await approvalTx.wait();
      }
  
      // List NFT
      const tx = await marketplace.listItem(tokenId, priceWei);
      await tx.wait();
  
      alert(`✅ NFT #${tokenId} listed for ${priceInEth} ETH`);
    } catch (err) {
      console.error("Error while listing NFT:", err);
      if (err?.data?.message) console.error("Detailed message:", err.data.message);
      else if (err?.error?.message) console.error("Error.message:", err.error.message);
      else if (err?.message) console.error("Message:", err.message);
      alert("❌ Failed to list NFT. See console for details.");
    }
  };
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">My Buddha NFTs</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading NFTs...</p>
      ) : nfts.length === 0 ? (
        <p className="text-center text-gray-500">You don’t own any NFTs yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {nfts.map((nft) => {
            const yearAttr = nft.metadata.attributes?.find(attr => attr.trait_type === "Year");
            const frameAttr = nft.metadata.attributes?.find(attr => attr.trait_type === "Frame");

            return (
              <div key={nft.tokenId} className="border p-4 rounded shadow">
                <img
                  src={nft.metadata.image?.replace("ipfs://", "https://ipfs.io/ipfs/")}
                  alt={nft.metadata.name}
                  className="h-48 object-cover w-full rounded mb-2"
                />
                <h3 className="text-lg font-semibold">{nft.metadata.name}</h3>
                <p className="text-sm text-gray-600">{nft.metadata.description}</p>
                <p className="text-sm mt-1 text-gray-500">Year: {yearAttr?.value || "N/A"}</p>
                <p className="text-sm text-gray-500">Frame: {frameAttr?.value || "N/A"}</p>
                <button
                  onClick={() => {
                    setSelectedTokenId(nft.tokenId);
                    setShowModal(true);
                  }}
                  className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Sell
                </button>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <SellNFTModal
          tokenId={selectedTokenId}
          onSell={handleSell}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default MyNFTs;