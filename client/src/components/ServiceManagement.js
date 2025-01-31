import React, { useState, useEffect } from 'react';
import './ServiceManagement.css';

const ServiceManagement = () => {
    const [vehicles, setVehicles] = useState([]);
    const [mechanics, setMechanics] = useState([]);
    const [serviceData, setServiceData] = useState({ description: '', vehicle_id: '', mechanic_id: '' });
    const [services, setServices] = useState([]); 
    const [editingServiceId, setEditingServiceId] = useState(null); // Track which service is being edited

    // Fetch vehicles, mechanics, and services
    useEffect(() => {
        fetch('http://localhost:5555/vehicles')
            .then((response) => response.json())
            .then((data) => setVehicles(data))
            .catch((error) => console.error('Error fetching vehicles:', error));

        fetch('http://localhost:5555/mechanics')
            .then((response) => response.json())
            .then((data) => setMechanics(data))
            .catch((error) => console.error('Error fetching mechanics:', error));

        fetch('http://localhost:5555/services')
            .then((response) => response.json())
            .then((data) => setServices(data))
            .catch((error) => console.error('Error fetching services:', error));
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setServiceData({ ...serviceData, [e.target.name]: e.target.value });
    };

    // Handle form submission for creating/updating service
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editingServiceId) {
            // Update existing service
            const response = await fetch(`http://localhost:5555/services/${editingServiceId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(serviceData),
            });

            if (response.ok) {
                const updatedService = await response.json();
                setServices(services.map(service => service.id === editingServiceId ? updatedService : service));
                setEditingServiceId(null); // Reset edit mode
            } else {
                console.error('Failed to update service');
            }
        } else {
            // Create new service
            const response = await fetch('http://localhost:5555/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(serviceData),
            });

            if (response.ok) {
                const newService = await response.json();
                setServices([...services, newService]); // Add new service to list
            } else {
                console.error('Failed to submit service');
            }
        }

        setServiceData({ description: '', vehicle_id: '', mechanic_id: '' }); // Clear form
    };

    // Handle edit button click
    const handleEdit = (service) => {
        setServiceData({
            description: service.description,
            vehicle_id: service.vehicle_id,
            mechanic_id: service.mechanic_id,
        });
        setEditingServiceId(service.id);
    };

    // Handle delete button click
    const handleDelete = async (id) => {
        const response = await fetch(`http://localhost:5555/services/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setServices(services.filter(service => service.id !== id)); // Remove from UI
        } else {
            console.error('Failed to delete service');
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

                <button type="submit">
                    {editingServiceId ? 'Update Service' : 'Submit Service'}
                </button>
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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service) => {
                            const vehicle = vehicles.find((v) => v.id === parseInt(service.vehicle_id));
                            const mechanic = mechanics.find((m) => m.id === parseInt(service.mechanic_id));
                            const mechanicName = mechanic?.name || 'Unknown';

                            return (
                                <tr key={service.id}>
                                    <td>{vehicle?.make} {vehicle?.model}</td>
                                    <td>{mechanicName}</td>
                                    <td>{service.description}</td>
                                    <td>
                                        <button onClick={() => handleEdit(service)}>Edit</button>
                                        <button onClick={() => handleDelete(service.id)}>Delete</button>
                                    </td>
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
