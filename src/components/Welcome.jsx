import {Autocomplete, Box, TextField} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import {AiFillPlayCircle} from "react-icons/ai";
import {BsInfoCircle} from "react-icons/bs";
import {SiEthereum} from "react-icons/si";
import {Loader} from ".";
import {showAlert} from "../common/Toast";

import {TransactionContext} from "../context/TransactionContext";
import axios from "../utilities/axios";
import {shortenAddress} from "../utils/shortenAddress";
import ContactsModal from "./ContactsModal";

const companyCommonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

function Input({ placeholder, name, type, value, handleChange }) {
  return (<input
      className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
      onChange={(e) => handleChange(e, name)}
      placeholder={placeholder}
      step="0.0001"
      type={type}
      value={value}
          />)
}

function Welcome({isAuthenticated}) {
  const { currentAccount, connectWallet, handleChange, formData, isLoading, deployContract } = useContext(TransactionContext);
  const [modal, setModal] = useState("");

    const [groups, setGroups] = useState([]);
    const [contactsFlag, setContactsFlag] = useState(true);
    const [groupsFlag, setGroupsFlag] = useState(true);
    const [contacts, setContacts] = useState([]);


    useEffect(() => {
        if (groupsFlag)
            axios.get("/app/group/").then(response => {
                setGroupsFlag(false);
                setGroups(response.data.map(group => ({
                    label: group.name,
                    value: group.slug,
                    description: group.description,
                    // type: "group"
                })));
            });
        if (contactsFlag && isAuthenticated)
            axios.get("/app/contacts/list").then(response => {
                setContactsFlag(false);
                setContacts(response.data.map(contact => ({
                    label: contact.First_Name + " " + contact.Last_Name,
                    value: contact.email,
                    description: "",
                    // type: "group"
                })));
            });
    })

  const handleDeploy = (e) => {
    const { addressTo, markedFor, amount, message, expiry } = formData;

    e.preventDefault();

    if (!addressTo || !markedFor || !amount || !message) {
        console.log("Incomplete form, can't deploy!");
        return;
    }

    axios.post("/app/form/", {
        addressTo,
        markedFor,
        amount,
        message,
        addressFrom: currentAccount.address,
        expiry
    }).then((res) => {
    alert("Transaction form sent successfully!");
    // console.log(res.data)
        let data = res.data;
    // convert date to epoch
        if (data.expiry) {
            let date = new Date(data.expiry);
            // console.log(epoch);
            data.iso_expiry = date.expiry;
            data.expiry = date.getTime() / 1000;
        }
        else {
            data.expiry = 0;
            data.iso_expiry = undefined;
        }
    console.log(data);
    deployContract(data);
    }).catch(err => {
    console.log(err);
    });


  };
    console.log(formData);

  return (
      <div className="flex w-full justify-center items-center">
          <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
              <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
                  <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
                      Send Crypto
                      {' '}

                      <br />

                      {' '}
                      across the world
                  </h1>

                  <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
                      Explore the crypto world. Buy and sell cryptocurrencies easily on Krypto.
                  </p>

                  {!currentAccount && (
                  <button
                      className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
                      onClick={connectWallet}
                      type="button"
                  >
                      <AiFillPlayCircle className="text-white mr-2" />

                      <p className="text-white text-base font-semibold">
                          Connect Wallet
                      </p>
                  </button>
          )}

                  {isAuthenticated && (
                      <>
                          <button
                              className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
                              onClick={() => setModal("contacts")}
                              type="button"
                          >


                              <p className="text-white text-base font-semibold">
                                  Show Contacts
                              </p>

                              <AiFillPlayCircle className="text-white ms-2" />
                          </button>

                          <ContactsModal
                              onHide={() => setModal("")}
                              show={modal === "contacts"}
                          />
                      </>)}

                  <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
                      <div className={`rounded-tl-2xl ${companyCommonStyles}`}>
                          Reliability
                      </div>

                      <div className={companyCommonStyles}>
                          Security
                      </div>

                      <div className={`sm:rounded-tr-2xl ${companyCommonStyles}`}>
                          Ethereum
                      </div>

                      <div className={`sm:rounded-bl-2xl ${companyCommonStyles}`}>
                          Web 3.0
                      </div>

                      <div className={companyCommonStyles}>
                          Low Fees
                      </div>

                      <div className={`rounded-br-2xl ${companyCommonStyles}`}>
                          Blockchain
                      </div>
                  </div>
              </div>

              <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
                  <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card .white-glassmorphism ">
                      <div className="flex justify-between flex-col w-full h-full">
                          <div className="flex justify-between items-start">
                              <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                                  <SiEthereum
                                      color="#fff"
                                      fontSize={21}
                                  />
                              </div>

                              <BsInfoCircle
                                  color="#fff"
                                  fontSize={17}
                              />
                          </div>

                          <div>
                              <p className="text-white font-light text-sm">
                                  {shortenAddress(currentAccount)}
                              </p>

                              <p className="text-white font-semibold text-lg mt-1">
                                  Ethereum
                              </p>
                          </div>
                      </div>
                  </div>

                  <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">

                      <Autocomplete
                          className="my-2 w-100 rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
                          disablePortal
                          getOptionLabel={(option) => option.label + " " + option.value + " " + option.description}
                          id="combo-box-demo"
                          inputValue={formData.addressTo}
                          onChange={(_, e) => {
                              handleChange({
                                  target: {
                                      value: e.value,
                                  }
                              }, "addressTo");
                          }}
                          options={contacts}
                          renderInput={(params) => {
                              return (
                                  <TextField
                                      {...params}
                                      label="Address To"
                                      name="addressTo"
                                      placeholder="Address To"
                                      variant="standard"
                                  />);
                          }}
                          renderOption={(props, option) => (
                              <Box
                                  component="li"
                                  sx={{'& > img': {mr: 2, flexShrink: 0}}}
                                  {...props}
                              >
                                  {option.label +"\n"+option.value}
                              </Box>
                          )}
                          sx={{width: 300}}
                          value={formData.addressTo}
                      />


                      <Autocomplete
                          className="my-2 w-100 rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
                          disablePortal
                          getOptionLabel={(option) => option.label + " " + option.value + " " + option.description}
                          id="combo-box-demo"
                          inputValue={formData.markedFor}
                          onChange={(_, e) => {
                              handleChange({
                                  target: {
                                      value: e.value,
                                  }
                              }, "markedFor");
                          }}
                          options={groups.concat(contacts)}
                          renderInput={(params) => {
                              return (
                                  <TextField
                                      {...params}
                                      label="Marked For"
                                      name="markedFor"
                                      placeholder="Marked For"
                                      variant="standard"
                                  />);
                          }}
                          renderOption={(props, option) => (
                              <Box
                                  component="li"
                                  sx={{'& > img': {mr: 2, flexShrink: 0}}}
                                  {...props}
                              >
                                  {option.label + "\n" + option.value}
                              </Box>
                          )}
                          sx={{width: 300}}
                          value={formData.markedFor}
                      />

                      <TextField
                          className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
                          onChange={(e) => handleChange(e, "amount")}
                          placeholder="Amount"
                          step="0.0001"
                          type="number"
                          value={formData.amount}
                          variant="standard"
                      />

                      <TextField
                          className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
                          onChange={(e) => handleChange(e, "message")}
                          placeholder="Message"
                          type="text"
                          value={formData.message}
                          variant="standard"
                      />

                      <label
                          className="py-0 my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism flex flex-row justify-start items-center"
                          htmlFor="expiry"
                      >
                          <p className="w-1/4 h-1/2">
                              Expiry:
                          </p>

                          <Input
                              handleChange={handleChange}
                              name="expiry"
                              placeholder="Enter Expiry Date"
                              type="date"
                              value={formData.expiry}
                          />
                      </label>


                      <div className="h-[1px] w-full bg-gray-400 my-2" />

                      {isLoading
              ? <Loader />
              : (
                  <button
                      className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                      onClick={handleDeploy}
                      type="button"
                  >
                      Send marked money now(deploy contract)
                  </button>
              )}

                  </div>
              </div>
          </div>

      </div>
  );
}

export default Welcome;
