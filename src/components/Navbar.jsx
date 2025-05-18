import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ethers } from "ethers";

const Navbar = () => {
  const location = useLocation();
  const [account, setAccount] = useState(null);

  const linkStyle = (path) =>
    `px-4 py-2 rounded hover:bg-blue-100 ${
      location.pathname === path ? "bg-blue-200 font-semibold" : ""
    }`;

  const truncateAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  useEffect(() => {
    const checkWalletConnected = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) setAccount(accounts[0]);
      }
    };
    checkWalletConnected();
  }, []);

  return (
    <nav className="bg-white/80 backdrop-blur border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-900 tracking-tight">BuddhaNFT</h1>
  
        <div className="hidden md:flex items-center gap-6">
          {[
            { path: "/", label: "Home" },
            { path: "/mint", label: "Mint" },
            { path: "/marketplace", label: "Marketplace" },
            { path: "/english", label: "English" },
            { path: "/lucky", label: "LuckyBid" },
            { path: "/manager", label: "Manager" },
            { path: "/my", label: "My NFTs" },
          ].map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`text-sm text-gray-700 hover:text-black transition ${
                linkStyle(path)
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
  
        <div className="flex items-center gap-3">
          {account ? (
            <span className="text-xs font-mono text-gray-600 bg-gray-100 px-3 py-1 rounded-md border border-gray-300">
              {truncateAddress(account)}
            </span>
          ) : (
            <button
              onClick={connectWallet}
              className="text-sm px-4 py-2 rounded-md bg-black text-white hover:bg-gray-900 transition"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
