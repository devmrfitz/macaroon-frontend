
// Modal to show contacts in a table


import React, {useState} from "react";
import {Button, Modal,} from "react-bootstrap";
import { Table } from 'react-bootstrap';
import {showAlert} from "../common/Toast";

import axios from "../utilities/axios";


export default function ContactsModal(props) {
    const {show, onHide} = props;

    const [contacts, setContacts] = useState([]);
    const [newContact, setNewContact] = useState("");

    axios.get("/app/contacts/list").then(response => {
        setContacts(response.data);
    });


    function handleHide() {
        onHide();
    }

    // bootstrap table to display contacts
    const table = (
        <Table
            bordered
            condensed
            hover
            striped
        >
            <thead>
                <tr>
                    <th>
                        Name
                    </th>

                    <th>
                        Email
                    </th>

                    <th>
                        Public Key
                    </th>

                    <th />
                </tr>
            </thead>

            <tbody>
                {contacts.map(contact => (
                    <tr key={contact.id}>
                        <td>
                            {contact.First_Name + " " +contact.Last_Name}
                        </td>

                        <td>
                            {contact.email}
                        </td>

                        <td>
                            {contact.public_key}
                        </td>

                        <td>
                            <a
                                className="text-primary"
                                href="#"
                            >
                                Send money
                            </a>
                        </td>

                        {/*<Button
                                bsSize="xsmall"
                                bsStyle="danger"
                                onClick={() => handleDeleteContact(contact.id)}
                            >
                                <FaTrash />
                            </Button>

                            <Button
                                bsSize="xsmall"
                                bsStyle="info"
                                onClick={() => handleEditContact(contact.id)}
                            >
                                <FaEdit />
                            </Button>*/}

                    </tr>
            ))}
            </tbody>
        </Table>
    );

    // put the table in a bootstrap modal
    const modal = (
        <Modal
            aria-labelledby="contained-modal-title-lg"
            bsSize="large"
            onHide={handleHide}
            show={show}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-lg">
                    Contacts
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <br />

                {table}
            </Modal.Body>

            <Modal.Footer>
                {/*    input field to add new contact */}

                <input
                    className="form-control"
                    onChange={e => setNewContact(e.target.value)}
                    placeholder="New contact's email"
                    value={newContact}
                />

                <Button
                    className="btn btn-primary"
                    onClick={() => {
                        axios.post("/app/contacts/add/", {
                            email: newContact,
                        }).then(response => {
                            setContacts([...contacts, response.data]);
                            showAlert( "Contact added successfully", "success");
                            setNewContact("");
                        }).catch(error => {
                            // check status code
                            if (error.response.status === 404) {
                                showAlert("Email address not found in database", "error");
                            }
                        });
                    }}
                >
                    Add Contact
                </Button>
            </Modal.Footer>
        </Modal>
    );

    return (
        <div>
            {modal}
        </div>
    );
}

