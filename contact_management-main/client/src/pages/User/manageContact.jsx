import { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Table, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useAuth } from '../../context/authContext';

const ManageContact = () => {
    const { user, token } = useAuth();
    const [contacts, setContacts] = useState([]);
    const [formData, setFormData] = useState({ name: '', phoneNo: '', email: '', designation: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Fetch all contacts
    const fetchContacts = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/v0/contact/getAllContacts', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setContacts(response.data.contacts);
        } catch (err) {
            toast.error('Error fetching contacts');
        }
    };

    useEffect(() => {
        if (token) fetchContacts();
    }, [token]);

    // Form onchange
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            if (editingId) {
                await axios.put(`http://localhost:3001/api/v0/contact/updateContact/${editingId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success('Contact updated successfully');
            } else {
                await axios.post('http://localhost:3001/api/v0/contact/createContact', formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success('Contact created successfully');
            }
            setFormData({ name: '', phoneNo: '', email: '', designation: '' });
            setEditingId(null);
            fetchContacts();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error creating/updating contact');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (contactId) => {
        try {
            const response = await axios.delete(
                `http://localhost:3001/api/v0/contact/deleteContact/${contactId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                setContacts((prevContacts) => prevContacts.filter((contact) => contact._id !== contactId));
                toast.success('Contact deleted successfully');
            } else {
                toast.error(response.data.message || 'Failed to delete contact');
            }
        } catch (error) {
            toast.error('Permission denied');
        }
    };

    const handleEdit = (contact) => {
        setFormData(contact);
        setEditingId(contact._id);
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center">Manage Contacts</h2>
            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Col md={3}><Form.Control type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required /></Col>
                    <Col md={3}><Form.Control type="tel" name="phoneNo" value={formData.phoneNo} onChange={handleChange} placeholder="Phone Number" pattern="^\d{10}$" required /></Col>
                    <Col md={3}><Form.Control type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required /></Col>
                    <Col md={3}><Form.Control type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder="Designation" required /></Col>
                </Row>
                <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
                    {isLoading ? <Spinner animation="border" size="sm" /> : editingId ? 'Update Contact' : 'Create Contact'}
                </Button>
            </Form>

            <h2 className="mt-5">Contact List</h2>
            <Table striped bordered hover>
                <thead className="table-primary text-center">
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Phone Number</th>
                        <th>Email</th>
                        <th>Designation</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody className='text-center'>
                    {contacts.length === 0 ? (
                        <tr><td colSpan="7" className="text-center text-danger">No contacts found</td></tr>
                    ) : (
                        contacts.map((contact, index) => (
                            <tr key={contact._id}>
                                <td>{index + 1}</td>
                                <td>{contact.name}</td>
                                <td>{contact.phoneNo}</td>
                                <td>{contact.email}</td>
                                <td>{contact.designation}</td>
                                <td><FaEdit style={{ color: 'blue', cursor: 'pointer', marginRight: '10px' }} onClick={() => handleEdit(contact)} /></td>
                                <td><FaTrash style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleDelete(contact._id)} /></td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </Container>
    );
};

export default ManageContact;

