import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

import { _abi }from "./abiConstants";
import bytecode from "./bytecode.js";

export const TransactionContext = React.createContext();



const { ethereum } = window;

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionsContract;
};

const createContractFactory = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);
  
  // const bytecode = fs.readFileSync('test_contract_sol_Macroon.bin').toString();
  const abi = _abi;
  console.log("CONTRACT ABI: " + abi);
  console.log("CONTRACT ABI: " + bytecode);

  const factory = new ethers.ContractFactory(abi, bytecode, signer);

  const senderAdress = signer.getAddress();

  // var contract = null;
  // factory.deploy([senderAdress,]).then((c) => { contract = c});

  var contract =  factory.deploy([senderAdress,]);

   contract.deployContract.wait();

  console.log("CONTRACT ADDRESS" + contract.address);


  return contract;
};

export const TransactionsProvider = ({ children }) => {
  const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();

        const availableTransactions = await transactionsContract.getAllTransactions();

        const structuredTransactions = availableTransactions.map((transaction) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
          message: transaction.message,
          keyword: transaction.keyword,
          amount: parseInt(transaction.amount._hex) / (10 ** 18)
        }));

        console.log(structuredTransactions);

        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log("CHECK IF WALLERY IS CONNNNNNNNN");
      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        getAllTransactions();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfTransactionsExists = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();
        const currentTransactionCount = await transactionsContract.getTransactionCount();

        window.localStorage.setItem("transactionCount", currentTransactionCount);
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts", });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const sendTransaction = async () => {
    try {
      if (ethereum) {
        const { addressTo, amount, keyword, message } = formData;
        const transactionsContract = createEthereumContract();
        const parsedAmount = ethers.utils.parseEther(amount);

        await ethereum.request({
          method: "eth_sendTransaction",
          params: [{
            from: currentAccount,
            to: addressTo,
            gas: "0x5208",
            value: parsedAmount._hex,
          }],
        });

        const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);

        const transactionsCount = await transactionsContract.getTransactionCount();



        setTransactionCount(transactionsCount.toNumber());
        deployContract();
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const deployContract = async () => {
    try {
      if (ethereum) {
        // const { addressTo, amount, keyword, message } = formData;
        // const transactionsContract = createEthereumContract();
        // const parsedAmount = ethers.utils.parseEther(amount);

        // await ethereum.request({
        //   method: "eth_sendTransaction",
        //   params: [{
        //     from: currentAccount,
        //     to: addressTo,
        //     gas: "0x5208",
        //     value: parsedAmount._hex,
        //   }],
        // });

        // const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

        // setIsLoading(true);
        // console.log(`Loading - ${transactionHash.hash}`);
        // await transactionHash.wait();
        // console.log(`Success - ${transactionHash.hash}`);
        // setIsLoading(false);

        // const transactionsCount = await transactionsContract.getTransactionCount();

        // setTransactionCount(transactionsCount.toNumber());
        

        // const contract = createContractFactory();

        if(!window.ethereum) {
          console.log("WTF WTF WTF");
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);
        
        // const bytecode = fs.readFileSync('test_contract_sol_Macroon.bin').toString();
        const abi = _abi;
        console.log("CONTRACT ABI: " + abi);
        console.log("SIGNER   " + provider.getSigner());

        const factory = new ethers.ContractFactory(abi, bytecode, signer);

        console.log("FACTORY CREATED");

        // const senderAdress = signer.getAddress();
        const senderAdress = '0xfe024708B8556F66D18199b2c498F1c93eAb6eA4';

        // var contract = null;
        // factory.deploy([senderAdress,]).then((c) => { contract = c});

        // var contract = await factory.deploy('0xfe024708B8556F66D18199b2c498F1c93eAb6eA4');
        var contract = await factory.deploy(senderAdress, 0);
        // console.log("CONTRACT ABI: " + bytecode);
        // contract.deployTransaction;
      
        await contract.deployTransaction.wait()

        console.log("CONTRACT ADDRESS: " + contract.address);


      } else {
        console.log("No ethereum object  HELLLLLLLLO");
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object Hell2");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionsExists();
    console.log("THIS IS BEING CALLED LOLOLOLOLOLOLOLOLOLOL!!!!!!!!!!");
  }, [transactionCount]);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
        deployContract,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
