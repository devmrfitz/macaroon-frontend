
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
                Marked Transactions Received
            </h1>

            <p>
                This is a list of transactions that you have received.
            </p>

            <div className="row w-100 m-2 py-2">
                {transactions.map((transaction) => (
                    <Card
                        className="col-auto gradient-bg-transactions text-left"
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

                            <Button onClick={()=> {
                                setShowModal(transaction.contract_address);
                            }}
                            >
                                Interact
                            </Button>

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
