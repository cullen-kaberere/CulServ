import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ServiceManagement.css'; // Keep CSS import

const ServiceManagement = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [mechanics, setMechanics] = useState([]);
    const [serviceData, setServiceData] = useState({ description: '', vehicle_id: '', mechanic_id: '' });

    useEffect(() => {
        fetch('http://localhost:5000/api/vehicles')
            .then((response) => response.json())
            .then((data) => setVehicles(data))
            .catch((error) => console.error('Error fetching vehicles:', error));

        fetch('http://localhost:5000/api/mechanics')
            .then((response) => response.json())
            .then((data) => setMechanics(data))
            .catch((error) => console.error('Error fetching mechanics:', error));
    }, []);

    const handleChange = (e) => {
        setServiceData({ ...serviceData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(serviceData),
        });

        if (response.ok) {
            navigate('/'); // Navigate back to home after submission
        } else {
            console.error('Failed to submit service');
        }
    };

    return (
        <div>
            <nav className="navbar">
                <div>CulServ</div>
                <a href="/">Home</a>
            </nav>
            <div className="service-management-container">
                <h2>Service Management</h2>
                <form onSubmit={handleSubmit}>
                    <label>Vehicle:</label>
                    <select
                        name="vehicle_id"
                        value={serviceData.vehicle_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Vehicle</option>
                        {vehicles.map((vehicle) => (
                            <option key={vehicle.id} value={vehicle.id}>
                                {vehicle.make} {vehicle.model}
                            </option>
                        ))}
                    </select>
    
                    <label>Mechanic:</label>
                    <select
                        name="mechanic_id"
                        value={serviceData.mechanic_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Mechanic</option>
                        {mechanics.map((mechanic) => (
                            <option key={mechanic.id} value={mechanic.id}>
                                {mechanic.name}
                            </option>
                        ))}
                    </select>
    
                    <label>Service Description:</label>
                    <input
                        type="text"
                        name="description"
                        value={serviceData.description}
                        onChange={handleChange}
                        required
                    />
    
                    <button type="submit">Submit Service</button>
                </form>
            </div>
        </div>
    );
    
};

export default ServiceManagement;
