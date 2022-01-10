// create a modal for final payment


import {Autocomplete, Box, TextField} from "@mui/material";
import React, {useContext, useState} from "react";
import { Modal, Button } from 'react-bootstrap';
import {TransactionContext} from "../context/TransactionContext";
import axios from "../utilities/axios";

function Input({placeholder, name, type, value, handleChange}) {
    return (<input
        className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
        onChange={(e) => handleChange(e, name)}
        placeholder={placeholder}
        step="0.0001"
        type={type}
        value={value}
            />)
}

export default function FinalPaymentModal({contacts, show, setShow, contract_address}) {

    const {
        interactContract,
    } = useContext(TransactionContext);

    const [formData, setformData] = useState({addressTo: "", amount: "", message: "", });

    const handleChange = (e, name) => {
        setformData((prevState) => ({...prevState, [name]: e.target.value}));
    };

    console.log(contract_address)

    const addressTo = formData.addressTo;
    const amount = formData.amount;
    const message = formData.message;

    return (
        <Modal
            className=" gradient-bg-transactions"
            onHide={setShow}
            show={show}
        >
            <Modal.Header
                className=" gradient-bg-transactions text-white"
            >
                <Modal.Title>
                    Final Payment
                </Modal.Title>
            </Modal.Header>

            <Modal.Body
                className=" gradient-bg-transactions  text-white"
            >
                <p>
                    Please enter your payment details below.
                </p>

                <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">

                    <Autocomplete
                        disablePortal
                        getOptionLabel={(option) => option.label + " " + option.value + " " + option.description}
                        id="combo-box-demo"
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
                                {option.label + "\n" + option.value}
                            </Box>
                      )}
                        sx={{width: 300}}
                        className="my-2 w-100 rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"

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


                    <div className="h-[1px] w-full bg-gray-400 my-2" />
                </div>


            </Modal.Body>

            <Modal.Footer
                className=" gradient-bg-transactions  text-white"
            >
                <Button
                    bsStyle="primary"
                    onClick={() => {

                        axios.post("/app/form/", {
                            addressTo,
                            markedFor: [],
                        }).then((res) => {
                            const addressTo = res.data.addressTo;
                            console.log("passing", contract_address, message, addressTo.trim(), amount.toString());
                            interactContract({contract_address, message, addressTo, amount});
                        }
                        );}}
                >
                    Pay Now
                </Button>
            </Modal.Footer>
        </Modal>
  );
}
