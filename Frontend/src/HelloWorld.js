import React, { useEffect, useState } from "react";
import {
  loadCurrentMessage, 
  connectWallet, 
  getCurrentWalletConnected, 
  updateMessage, 
  addSmartContractListener,
  addWalletListener,
  contractAddress,
} from "./util/interact.js";

import alchemylogo from "./alchemylogo.svg";

const HelloWorld = () => {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("No connection to the network."); 
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchInitialData() {
      const message = await loadCurrentMessage();
      setMessage(message);

      const { address, status } = await getCurrentWalletConnected();
      setWallet(address);
      setStatus(status);

      addSmartContractListener(setMessage); 
      addWalletListener(setWallet, setStatus);
    }
    fetchInitialData();
  }, []);

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onUpdatePressed = async () => {
    setIsLoading(true);
    setStatus("Initiating transaction... please confirm in MetaMask.");

    const { status } = await updateMessage(walletAddress, newMessage);
    
    setStatus(status);
    setIsLoading(false);
    setNewMessage("");
  };

  return (
    <div id="container">
      <img id="logo" src={alchemylogo} alt="Alchemy Logo" />
      
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " + String(walletAddress).substring(0, 6) + "..." + String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <h2 style={{ paddingTop: "50px" }}>Current Message:</h2>
      <p>{message}</p>

      <h2 style={{ paddingTop: "18px" }}>New Message:</h2>

      <div>
        <input
          type="text"
          placeholder="Update the message in your smart contract."
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <p id="status">{status}</p>

        <button 
          id="publish" 
          onClick={onUpdatePressed} 
          disabled={isLoading || walletAddress.length === 0}
        >
          {isLoading ? (
            <>
              <div className="spinner"></div>
              Updating...
            </>
          ) : (
            "Update"
          )}
        </button>
      </div>

      <footer style={{ marginTop: "30px" }}>
        <button id="viewContractButton">
          <a 
            href={`https://sepolia.etherscan.io/address/${contractAddress}`}
            target="_blank" 
            rel="noreferrer"
          >
            View on Etherscan
          </a>
        </button>
      </footer>
    </div>
  );
};

export default HelloWorld;