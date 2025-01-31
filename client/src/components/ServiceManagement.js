import React, { useState, useEffect } from 'react';
import './ServiceManagement.css';

const ServiceManagement = () => {
    const [vehicles, setVehicles] = useState([]);
    const [mechanics, setMechanics] = useState([]);
    const [serviceData, setServiceData] = useState({ description: '', vehicle_id: '', mechanic_id: '' });
    const [services, setServices] = useState([]); // State to store submitted services

    // Fetch vehicles and mechanics
    useEffect(() => {
        fetch('http://localhost:5555/vehicles')
            .then((response) => response.json())
            .then((data) => setVehicles(data))
            .catch((error) => console.error('Error fetching vehicles:', error));

        fetch('http://localhost:5555/mechanics')
            .then((response) => response.json())
            .then((data) => setMechanics(data))
            .catch((error) => console.error('Error fetching mechanics:', error));
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setServiceData({ ...serviceData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5555/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(serviceData),
        });

        if (response.ok) {
            const newService = await response.json();
            setServices([...services, newService]); // Add the new service to the list
            setServiceData({ description: '', vehicle_id: '', mechanic_id: '' }); // Clear the form
        } else {
            console.error('Failed to submit service');
        }
    };

    return (
        <div className="service-management-container">
            <h2>Service Management</h2>
            <form onSubmit={handleSubmit}>
                {/* Select Vehicle */}
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

                {/* Select Mechanic */}
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

                {/* Service Description */}
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

            {/* Display Submitted Services */}
            <div className="services-list">
                <h3>Submitted Services</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Vehicle</th>
                            <th>Mechanic Name</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service) => {
                            const vehicle = vehicles.find((v) => v.id === parseInt(service.vehicle_id));
                            const mechanic = mechanics.find((m) => m.id === parseInt(service.mechanic_id));
                            const mechanicName = mechanic?.name || 'Unknown'; // Assuming `name` exists in mechanics

                            return (
                                <tr key={service.id}>
                                    <td>{vehicle?.make} {vehicle?.model}</td>
                                    <td>{mechanicName}</td>
                                    <td>{service.description}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ServiceManagement;
