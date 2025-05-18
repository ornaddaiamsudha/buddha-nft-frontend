import { ethers } from "ethers";
import BuddhaNFTArtifact from "../abis/BuddhaNFT.json";
import MarketplaceArtifact from "../abis/Marketplace.json";
import AuctionManagerArtifact from "../abis/AuctionManager.json";
import EnglishAuctionArtifact from "../abis/EnglishAuction.json";
import LuckyBidAuctionArtifact from "../abis/LuckyBidAuction.json";

import addressMap from "./contractAddress.json";

export const BUDDHA_NFT_ADDRESS = addressMap.BUDDHA_NFT_ADDRESS;
export const MARKETPLACE_ADDRESS = addressMap.MARKETPLACE_ADDRESS;
export const AUCTION_MANAGER_ADDRESS = addressMap.AUCTION_MANAGER_ADDRESS;

// ========== Shared Utilities ==========

export function getProvider() {
  if (!window.ethereum) throw new Error("Please install MetaMask!");
  return new ethers.providers.Web3Provider(window.ethereum);
}

export async function getSigner() {
  const provider = getProvider();
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
}

export function getBuddhaNFT(providerOrSigner) {
  return new ethers.Contract(BUDDHA_NFT_ADDRESS, BuddhaNFTArtifact.abi, providerOrSigner);
}

export async function getMarketplace() {
  const signer = await getSigner();
  return new ethers.Contract(MARKETPLACE_ADDRESS, MarketplaceArtifact.abi, signer);
}

// ========== NFT Minting & Ownership ==========

export async function mintNFT(metadataURL) {
  const signer = await getSigner();
  const nft = getBuddhaNFT(signer);
  const userAddress = await signer.getAddress();
  const tx = await nft.mint(userAddress, metadataURL);
  await tx.wait();
}

export async function getOwnedNFTs() {
  const provider = getProvider();
  const signer = await getSigner();
  const nft = getBuddhaNFT(provider);
  const userAddress = await signer.getAddress();
  const balance = await nft.balanceOf(userAddress);
  const nfts = [];

  for (let i = 0; i < balance; i++) {
    try {
      const tokenId = await nft.tokenOfOwnerByIndex(userAddress, i);
      const uri = await nft.tokenURI(tokenId);
      const res = await fetch(uri.replace("ipfs://", "https://ipfs.io/ipfs/"));
      const metadata = await res.json();
      nfts.push({ tokenId: tokenId.toString(), metadata });
    } catch (err) {
      console.error(`Error loading token ${i}:`, err);
    }
  }

  return nfts;
}

// ========== Marketplace ==========

export async function getListedItems() {
  const provider = getProvider();
  const nft = getBuddhaNFT(provider);
  const marketplace = new ethers.Contract(MARKETPLACE_ADDRESS, MarketplaceArtifact.abi, provider);
  const listed = [];

  const nextTokenId = await nft.nextTokenId();

  for (let tokenId = 0; tokenId < nextTokenId; tokenId++) {
    try {
      const item = await marketplace.listings(tokenId);
      if (item.price && item.price.toString() !== "0") {
        const uri = await nft.tokenURI(tokenId);
        const metadata = await (await fetch(uri.replace("ipfs://", "https://ipfs.io/ipfs/"))).json();
        listed.push({
          tokenId: tokenId.toString(),
          metadata,
          price: ethers.utils.formatEther(item.price),
        });
      }
    } catch (err) {
      console.warn(`Skipping token ${tokenId}:`, err.message);
    }
  }

  return listed;
}

export async function buyItem(tokenId, price) {
  const marketplace = new ethers.Contract(MARKETPLACE_ADDRESS, MarketplaceArtifact.abi, await getSigner());
  const tx = await marketplace.buyItem(tokenId, {
    value: ethers.utils.parseEther(price.toString()),
  });
  await tx.wait();
}

// ========== Auctions ==========

export async function createEnglishAuction(tokenId, duration) {
  const manager = new ethers.Contract(AUCTION_MANAGER_ADDRESS, AuctionManagerArtifact.abi, await getSigner());
  const tx = await manager.createEnglishAuction(tokenId, duration);
  await tx.wait();
}

export async function createLuckyBidAuction(tokenId, duration) {
  const manager = new ethers.Contract(AUCTION_MANAGER_ADDRESS, AuctionManagerArtifact.abi, await getSigner());
  const tx = await manager.createLuckyBidAuction(tokenId, duration);
  await tx.wait();
}

export async function getEnglishAuctions() {
  const provider = getProvider();
  const manager = new ethers.Contract(AUCTION_MANAGER_ADDRESS, AuctionManagerArtifact.abi, provider);
  const filter = manager.filters.EnglishAuctionCreated();
  const events = await manager.queryFilter(filter);
  return events.map(({ args }) => ({
    auctionAddress: args.auctionAddress,
    tokenId: args.tokenId.toString(),
    seller: args.seller,
    endsAt: args.endsAt.toString(),
  }));
}

export async function getLuckyBids() {
  const provider = getProvider();
  const manager = new ethers.Contract(AUCTION_MANAGER_ADDRESS, AuctionManagerArtifact.abi, provider);
  const filter = manager.filters.LuckyBidAuctionCreated();
  const events = await manager.queryFilter(filter);
  return events.map(({ args }) => ({
    auctionAddress: args.auctionAddress,
    tokenId: args.tokenId.toString(),
    seller: args.seller,
    endsAt: args.endsAt.toString(),
  }));
}

export async function bidEnglish(auctionAddress, amount) {
  const contract = new ethers.Contract(auctionAddress, EnglishAuctionArtifact.abi, await getSigner());
  const tx = await contract.bid({ value: ethers.utils.parseEther(amount.toString()) });
  await tx.wait();
}

export async function endEnglish(auctionAddress) {
  const contract = new ethers.Contract(auctionAddress, EnglishAuctionArtifact.abi, await getSigner());
  const tx = await contract.endAuction();
  await tx.wait();
}

export async function bidLucky(auctionAddress, amount) {
  const contract = new ethers.Contract(auctionAddress, LuckyBidAuctionArtifact.abi, await getSigner());
  const tx = await contract.bid({ value: ethers.utils.parseEther(amount.toString()) });
  await tx.wait();
}

export async function endLucky(auctionAddress) {
  const contract = new ethers.Contract(auctionAddress, LuckyBidAuctionArtifact.abi, await getSigner());
  const tx = await contract.endAuction();
  await tx.wait();
}