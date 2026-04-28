import { ethers } from "ethers";
import contractABI from "../HelloWorld.json";

const alchemyKey = "IsyquPDKCjCJnEctJpnqf";
export const contractAddress = "0x03dAC4c8220dA7E6A40c4Eab36a21d36F4B10A88";

const provider = new ethers.providers.JsonRpcProvider(
  `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`
);

export const helloWorldContract = new ethers.Contract(
  contractAddress,
  contractABI.abi,
  provider
);

export const loadCurrentMessage = async () => {
  const message = await helloWorldContract.message();
  return message;
};

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      return {
        status: "Write a message in the text box above.",
        address: addressArray[0],
      };
    } catch (err) {
      return {
        address: "",
        status: "Error: " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: "Please install MetaMask to use this dApp.",
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "Write a message in the text box above.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "Error: " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: "Please install MetaMask to use this dApp.",
    };
  }
};

export const updateMessage = async (address, message) => {
  if (!window.ethereum || address === "") {
    return {
      status: "Connect your wallet to update the message.",
    };
  }

  const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = web3Provider.getSigner();
  
  const contractWithSigner = helloWorldContract.connect(signer);

  try {
    const tx = await contractWithSigner.update(message);
    await tx.wait();
    return {
      status: "Success! The message has been updated.",
    };
  } catch (error) {
    return {
      status: "Error: " + error.message,
    };
  }
};

export const addSmartContractListener = (callback) => {
  helloWorldContract.on("UpdatedMessages", (oldStr, newStr) => {
    callback(newStr);
  });
};

export const addWalletListener = (setWallet, setStatus) => {
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        setWallet(accounts[0]);
        setStatus("Write a message in the text box above.");
      } else {
        setWallet("");
        setStatus("🦊 Connect to Metamask using the top right button.");
      }
    });
  }
};