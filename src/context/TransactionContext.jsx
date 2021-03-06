import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {showAlert} from "../common/Toast";
import axios from "../utilities/axios";
import MetaMaskOnboarding from '@metamask/onboarding';
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

export function TransactionsProvider({ children }) {
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
      if (!ethereum) return; // alert("Please install MetaMask.");

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
      if (!ethereum) {
        const onboarding = new MetaMaskOnboarding({
          forwarderOrigin: "https://macaroon.web.app",
        });
        onboarding.startOnboarding();
      }

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

  const deployContract = async ({addressTo, amount, expiry, message, markedFor, iso_expiry, raw}) => {
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

        const senderAdrress = await signer.getAddress();
        // console.log("SENDER ADDDDDRRR: " + senderAdress);

        console.log("CONTRACT DEPLOY ARGS: ", addressTo, expiry, message, senderAdrress, thirdParties);
        const contract = await factory.deploy(addressTo, expiry, message, senderAdrress, thirdParties
        , {
          value: parsedAmount,
        });

        const response = await contract.deployTransaction.wait()
        console.log("I received ", response)


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
        if (raw===0)
          await axios.post("app/transactions/save/", payload);
        showAlert("Contract marked and fully deployed!", "success");


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

        try {
          const senderAdress = await signer.getAddress();
          console.log("SENDER ADDDDDRRR: " + senderAdress);

          console.log("CONTRACT ADDRESS: " + contract.address);


          const pay_tx = await contract.payMoneyTo(addressTo, parsedAmount);
          console.log("pay_tx is ", pay_tx)
          console.log("interact received ", await pay_tx.wait());
        }
        catch (error) {
          console.log(error);
          showAlert("Invalid recipient", "error")
          return;
        }

        const payload = {
          moneyReceiver_public_key: addressTo,
          amount,
          message,
          current_contract_address,
        }
        await axios.post("app/payments/save/", payload)
        showAlert("Payment sent", "success")
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
}
