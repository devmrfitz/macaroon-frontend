
import React, {useEffect, useState} from "react";
import {Button, Card} from "react-bootstrap";
import axios from "../utilities/axios";
import FinalPaymentModal from "./FinalPaymentModal";
import Loading from "./Loading";

export default function MarkedTransactionsReceived({isAuthenticated}) {
    const [transactions, setTransactions] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [showModal, setShowModal] = React.useState("");
    const [contactsFlag, setContactsFlag] = useState(true);
    const [contacts, setContacts] = useState([]);


    useEffect(() => {
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

    useEffect(() => {
        if (loading)
            axios.get("/app/transactions/intermediary/")
                .then(response => {
                    setTransactions(response.data);
                    setLoading(false);
                })
    });

    if (loading)
        return <Loading />

    return (
        <div className=" text-white text-center justfy-center">
            <h1 className="h1">
                Marked Money in account
            </h1>

            <p>
                This is a list of marked packages/currency that you have received.
            </p>

            <div className="row w-100 m-2 p-2">
                {transactions.map((transaction) => (
                    <Card
                        className="flex col-auto justify-start text-left items-start white-glassmorphism p-3 m-2 cursor-pointer hover:shadow-xl"
                        // className="col-auto gradient-bg-transactions text-left"
                        key={transaction.transaction_id}
                        style={{"border-color": "white"}}
                    >
                        <Card.Header className="transaction-card-header">
                            <h3 className="h6">
                                Sender:
                                {' '}

                                {transaction.sender_email}
                            </h3>

                            <h3 className="h6">
                                Amount:
                                {' '}

                                {transaction.amount}
                            </h3>
                        </Card.Header>

                        <Card.Body className="transaction-card-body">
                            <p>
                                Message:
                                {" "}

                                {transaction.message}
                            </p>

                            <p>
                                Possible destinations:
                                {" "}

                                {transaction.destination_email.map((destination) => (
                                    <span key={destination}>
                                        {destination}

                                        {', '}
                                    </span>
                            ))}
                            </p>

                            <div className="w-100 d-flex justify-content-center">
                                <Button
                                    className="mt-4"
                                    onClick={()=> {
                                setShowModal(transaction.contract_address);
                            }}
                                >
                                    Interact
                                </Button>
                            </div>

                            <FinalPaymentModal
                                contacts={contacts}
                                contract_address={transaction.contract_address}
                                setShow={() => {setShowModal("")}}
                                show={transaction.contract_address === showModal}
                            />
                        </Card.Body>
                    </Card>
        ))}
            </div>
        </div>
    )
}
