"use client";

import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import Header from "@/components/headerSol";

const Page = () => {
  const { publicKey, connect, disconnect, connected } = useWallet();
  const [walletConnected, setWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const savedWallet = localStorage.getItem("solana_wallet_adapter");
    setWalletConnected(!!savedWallet);
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connect();
    } catch (error) {
      console.error("Failed to connect to wallet", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    localStorage.removeItem("solana_wallet_adapter");
    setWalletConnected(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <Header home />
      <h1>Login with Solana Wallet</h1>
      {/* Wallet Connect/Disconnect Button */}
      {/* <WalletMultiButton className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-700" /> */}
      <button
        onClick={connected ? handleDisconnect : handleConnect}
        className={`px-6 py-3 rounded-lg text-white ${
          connected ? "bg-red-500" : "bg-green-500"
        }`}
      >
        {isConnecting
          ? "Connecting..."
          : connected
          ? "Disconnect Wallet"
          : "Connect Wallet"}
      </button>
      {/* Wallet Status */}
      {publicKey ? (
        <div>
          <p>Connected Wallet:</p>
          <p>{publicKey.toBase58()}</p>
          <button onClick={handleDisconnect}>Disconnect</button>
        </div>
      ) : (
        <p>Connect your wallet to login.</p>
      )}
    </div>
  );
};

export default Page;
