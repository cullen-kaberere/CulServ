import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterClient.css'; // Keep CSS import

const RegisterClient = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [clientData, setClientData] = useState({ name: '', email: '' });
    const [selectedClient, setSelectedClient] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/api/clients')
            .then((response) => response.json())
            .then((data) => setClients(data))
            .catch((error) => console.error('Error fetching clients:', error));
    }, []);

    const handleChange = (e) => {
        setClientData({ ...clientData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/clients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientData),
        });

        if (response.ok) {
            navigate('/car-details');
        } else {
            console.error('Failed to register client');
        }
    };

    return (
        <div className="register-client-container">
            <h2>Register Client</h2>
            <form onSubmit={handleSubmit}>
                <label>Name:</label>
                <input type="text" name="name" value={clientData.name} onChange={handleChange} required />

                <label>Email:</label>
                <input type="email" name="email" value={clientData.email} onChange={handleChange} required />

                <button type="submit">Add Car</button>
            </form>

            <div className="existing-client">
                <label>If already registered:</label>
                <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
                    <option value="">Select Client</option>
                    {clients.map((client) => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                </select>
                <button onClick={() => navigate('/car-details')}>Car Details</button>
            </div>
        </div>
    );
};

export default RegisterClient;
