import React, { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import AvaxBridge from "../data/avaxBridge.json";
import AvaxERC20 from "../data/AvaxERC20.json";
import ZateBridge from "../data/ZateBridge.json";
import Networks from "../data/networkData.json";

export const AppContext = createContext();

const { ethereum } = typeof window !== "undefined" ? window : {};

const AppProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [signer, setSigner] = useState(null);
  const [balance, setBalance] = useState(0);
  const [network, setNetwork] = useState("");
  const [err, setError] = useState("");

  const getNetwork = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum, "any");
    const signer = provider.getSigner();
    const network = await signer.provider.getNetwork();
    const chainId = network.chainId;
    const isFujiNetwork = chainId === 43113;
    const networkName = isFujiNetwork ? "avax" : "zate";
    setNetwork(networkName);
    return networkName;
  };

  const checkEthereumExists = () => {
    if (!ethereum) {
      setError("Please Install MetaMask.");
      return false;
    }
    return true;
  };

  const getConnectedAccounts = async () => {
    try {
      const accounts = await ethereum.request({
        method: "eth_accounts",
      });
      setAccount(accounts[0]);
      await connectWallet();
      await getWalletBalance();
    } catch (err) {}
  };

  const connectWallet = async () => {
    if (checkEthereumExists()) {
      try {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        // Prompt user for account connections
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        getWalletBalance();
        changeNetwork();
        setSigner(signer);
      } catch (err) {}
    }
  };

  const getWalletBalance = async () => {
    if (checkEthereumExists()) {
      try {
        const networkName = await getNetwork();
        if (networkName === "avax") {
          //Fuji network
          const avaxErc = new ethers.Contract(
            AvaxERC20.address,
            JSON.stringify(AvaxERC20.abi),
            signer
          );
          const balance = await avaxErc.balanceOf(account);
          const balanceString = ethers.utils.formatEther(balance);
          setBalance(balanceString);
        } else {
          //ZATE network
          const balance = await signer.getBalance();
          const balanceString = ethers.utils.formatEther(balance);
          setBalance(balanceString);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const sendTransactionAvaxToZate = async (amount) => {
    try {
      const formattedAmount = ethers.utils.parseEther(amount);
      const avaxBridge = new ethers.Contract(
        AvaxBridge.address,
        JSON.stringify(AvaxBridge.abi),
        signer
      );
      const avaxErc = new ethers.Contract(
        AvaxERC20.address,
        JSON.stringify(AvaxERC20.abi),
        signer
      );
      const approveTx = await avaxErc.approve(
        AvaxBridge.address,
        formattedAmount
      );
      await approveTx.wait();

      const lockTx = await avaxBridge.lock(account, formattedAmount);
      const minedTx = await lockTx.wait();
      //success notification
      console.log(minedTx);
    } catch (err) {
      console.log(err);
    }
  };

  const sendTransactionZateToAvax = async (amount) => {
    try {
      const formattedAmount = ethers.utils.parseEther(amount);
      const zateBridge = new ethers.Contract(
        ZateBridge.address,
        JSON.stringify(ZateBridge.abi),
        signer
      );
      const burnTx = await zateBridge.burn(account, {
        value: formattedAmount,
      });
      const minedTx = await burnTx.wait();
      //success notification
      console.log(minedTx);
    } catch (err) {
      console.log(err);
    }
  };

  const changeNetwork = async () => {
    //Check current network and change accordingly
    try {
      const networkName = await getNetwork();
      if (networkName !== "avax") {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: Networks.fuji,
        });
      }
      getWalletBalance();
    } catch (err) {
      console.log(err);
    }
  };

  const resetBalance = () => {
    setBalance(0);
  };

  useEffect(() => {
    if (checkEthereumExists()) {
      ethereum.on("accountsChanged", getConnectedAccounts);
      ethereum.on("chainChanged", getWalletBalance);
      getConnectedAccounts();
    }
    return () => {
      ethereum.removeListener("accountsChanged", getConnectedAccounts);
      ethereum.removeListener("chainChanged", getWalletBalance);
    };
  }, []);

  useEffect(() => {
    getWalletBalance();
  }, [network, account]);

  return (
    <AppContext.Provider
      value={{
        account,
        balance,
        network,
        connectWallet,
        sendTransactionAvaxToZate,
        sendTransactionZateToAvax,
        changeNetwork,
        getWalletBalance,
        resetBalance,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
