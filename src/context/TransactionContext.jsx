import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "../utilities/axios";

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
  const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "", markedFor: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
  const [transactions, setTransactions] = useState([]);

  let current_contract_address;

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

  const deployContract = async ({addressTo, amount, expiry, message, markedFor, iso_expiry}) => {
    try {
      if (ethereum) {
        const parsedAmount = ethers.utils.parseEther(amount);

        if(!window.ethereum) {
          console.log("WTF WTF WTF");
        }

        // verify toAdress
        if(!ethers.utils.isAddress(addressTo)) {
          console.log("INVALID TO ADDRESS!");
          alert("INVALID TO ADDRESS!");
          return;
        }

        const thirdParties = markedFor;
        console.log(thirdParties);

        // verify third parties
        if(thirdParties.length === 0) {
          alert("Need to mark for atleast one address!");
          return;
        }
        let valid_third_parties = true;
        thirdParties.forEach((addr) => {
          if(!ethers.utils.isAddress(addr)){
            valid_third_parties = false;
          }
        });

        if(!valid_third_parties) {
          alert("Invalid marked for addresses!!");
          return;
        }


        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // const bytecode = fs.readFileSync('test_contract_sol_Macroon.bin').toString();
        const abi = _abi;
        console.log("CONTRACT ABI: " + abi);
        console.log("SIGNER   " + provider.getSigner());

        const factory = new ethers.ContractFactory(abi, bytecode, signer);

        console.log("FACTORY CREATED");

        // const senderAdress = await signer.getAddress();
        // console.log("SENDER ADDDDDRRR: " + senderAdress);


        const contract = await factory.deploy(addressTo, 0, {
          value: parsedAmount,
        });

        await contract.deployTransaction.wait()

        console.log("CONTRACT ADDRESS: " + contract.address);
        alert("Contract deployed at: " + contract.address);

        // updating global current contract address
        current_contract_address = contract.address;
        window.localStorage.setItem("current_contract_address", contract.address);
        const payload = {
          intermediary_public_key: addressTo,
          amount,
          expiry: iso_expiry,
          message,
          contract_address: current_contract_address,
          destination_public_keys: markedFor
        }
        await axios.post("app/transactions/save/", payload);

        const third_party_tx = await contract.addThirdParty(thirdParties);
        await third_party_tx.wait();
        console.log("Third Parties Added");
        alert("Contract marked and fully deployed!");


      } else {
        console.log("No ethereum object  HELLLLLLLLO");
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object Hell2");
    }
  };

  const interactContract = async ({addressTo, amount, message, contract_address}) => {
      if (ethereum) {
        const parsedAmount = ethers.utils.parseEther(amount);

        if(!window.ethereum) {
          console.log("WTF WTF WTF");
        }

        // verify toAddress
        if(!ethers.utils.isAddress(addressTo)) {
          console.log("INVALID TO ADDRESS!");
          alert("INVALID TO ADDRESS!");
          return;
        }

        current_contract_address = contract_address;

        console.log(current_contract_address);
        const abi = _abi;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(current_contract_address, abi, signer);

        const senderAdress = await signer.getAddress();
        console.log("SENDER ADDDDDRRR: " + senderAdress);

        console.log("CONTRACT ADDRESS: " + contract.address);


        const pay_tx = await contract.payMoneyTo(addressTo,  parsedAmount);
        await pay_tx.wait();
        const payload = {
          moneyReceiver_public_key: addressTo,
          amount,
          message
        }
        await axios.post("app/payments/save/", payload)
        console.log("FIRST SENT");

      } else {
        console.log("No ethereum object  HELLLLLLLLO");
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
        interactContract,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
