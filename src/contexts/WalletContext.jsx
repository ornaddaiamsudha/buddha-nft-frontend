import { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);

  // Automatically connect on app load
  useEffect(() => {
    const initWallet = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);
          setProvider(provider);
          console.log("✅ Wallet connected:", address);
        } catch (err) {
          console.warn("⚠️ Wallet connection rejected or failed:", err);
        }
      } else {
        alert("Please install MetaMask to use this app.");
      }
    };

    initWallet();
  }, []);

  // Manual connect function (if needed by a button)
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not installed.");
      return;
    }
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      setProvider(provider);
      console.log("✅ Wallet manually connected:", address);
    } catch (err) {
      console.warn("⚠️ Manual wallet connection failed:", err);
    }
  };

  return (
    <WalletContext.Provider value={{ account, provider, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};