import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CarDetails.css'; // Keep CSS import

const CarDetails = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');
    const [carData, setCarData] = useState({ make: '', model: '', year: '' });

    useEffect(() => {
        fetch('http://localhost:5555/clients')
            .then((response) => response.json())
            .then((data) => setClients(data))
            .catch((error) => console.error('Error fetching clients:', error));
    }, []);

    const handleChange = (e) => {
        setCarData({ ...carData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5555/vehicles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...carData, client_id: selectedClient }),
        });

        if (response.ok) {
            navigate('/service-management'); // Navigate after successful submission
        } else {
            console.error('Failed to save car details');
        }
    };

    return (
        <div>
            <nav className="navbar">
                <div>CulServ</div>
                <a href="/service-management">Home</a>
            </nav>
            <div className="car-details-container">
                <h2>Add Car Details Here</h2>
                <form onSubmit={handleSubmit}>
                    <label>Client:</label>
                    <select
                        value={selectedClient}
                        onChange={(e) => setSelectedClient(e.target.value)}
                        required
                    >
                        <option value="">Select Client</option>
                        {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                                {client.name}
                            </option>
                        ))}
                    </select>
    
                    <label>Make:</label>
                    <input
                        type="text"
                        name="make"
                        value={carData.make}
                        onChange={handleChange}
                        required
                    />
    
                    <label>Model:</label>
                    <input
                        type="text"
                        name="model"
                        value={carData.model}
                        onChange={handleChange}
                        required
                    />
    
                    <label>Year:</label>
                    <input
                        type="number"
                        name="year"
                        value={carData.year}
                        onChange={handleChange}
                        required
                    />
    
                    <button type="submit">Go to Service</button>
                </form>
                <p className="footer-note">
                    If already uploaded car detail: <a href="/service-management">Service page</a>
                </p>
            </div>
        </div>
    );
    
};

export default CarDetails;
