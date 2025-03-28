import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CarDetails.css';

const CarDetails = () => {
    const [vehicles, setVehicles] = useState([]);
    const [filter, setFilter] = useState('All Vehicles');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [newVehicle, setNewVehicle] = useState({
        make: '',
        model: '',
        year: '',
        number_plate: '',
        last_service_date: ''
    });

    // Fetch vehicles on component mount
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch('https://culserv.onrender.com/vehicles', {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                
                if (!response.ok) {
                    if (response.status === 401) {
                        navigate('/login');
                        return;
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                setVehicles(data);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchVehicles();
    }, [navigate]);

    // Handle input changes for the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewVehicle(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!user || !user.id) {
            setError('User not logged in');
            return;
        }
    
        try {
            const response = await fetch('https://culserv.onrender.com/vehicles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...newVehicle,
                    client_id: user.id,
                    year: parseInt(newVehicle.year, 10),
                }),
                credentials: 'include'
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to add vehicle');
            }
    
            const addedVehicle = await response.json();
            setVehicles(prev => [...prev, addedVehicle.vehicle || addedVehicle]);
            setShowModal(false);
            setNewVehicle({
                make: '',
                model: '',
                year: '',
                number_plate: '',
                last_service_date: ''
            });
        } catch (err) {
            console.error('Submission error:', err);
            setError(err.message);
        }
    };

    // Filter vehicles based on search term and filter
    const filteredVehicles = vehicles.filter(vehicle => {
        if (filter !== 'All Vehicles') {
            if (filter === 'Service Due' && !vehicle.serviceDue) return false;
            if (filter === 'Needs Attention' && !vehicle.needsAttention) return false;
        }
        
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            return (
                vehicle.make.toLowerCase().includes(searchLower) ||
                vehicle.model.toLowerCase().includes(searchLower) ||
                vehicle.number_plate.toLowerCase().includes(searchLower)
            );
        }
        
        return true;
    });

    // Count vehicles by status
    const getVehicleCount = (status) => {
        if (status === 'All Vehicles') return vehicles.length;
        if (status === 'Service Due') return vehicles.filter(v => v.serviceDue).length;
        if (status === 'Needs Attention') return vehicles.filter(v => v.needsAttention).length;
        return 0;
    };

    if (loading) return <div className="car-details-container">Loading...</div>;
    if (error) return <div className="car-details-container">Error: {error}</div>;

    return (
        <div className="car-details-container">
            <div className="header-section">
                <button 
                    className="add-vehicle-button" 
                    onClick={() => setShowModal(true)}
                >
                    Add Vehicle
                </button>
            </div>
            
            <div className="search-filter-container">
                <input
                    type="text"
                    placeholder="Search by make, model, or Number plate"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                
                <div className="filter-tabs">
                    {['All Vehicles', 'Service Due', 'Needs Attention'].map((status) => (
                        <button 
                            key={status}
                            className={filter === status ? 'active' : ''}
                            onClick={() => setFilter(status)}
                        >
                            {status} ({getVehicleCount(status)})
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="vehicle-list">
                {filteredVehicles.map(vehicle => (
                    <div key={vehicle.id} className="vehicle-card">
                        <div className="vehicle-header">
                            <h3>{vehicle.make} {vehicle.model} ({vehicle.year})</h3>
                        </div>
                        
                        <div className="vehicle-details">
                            <div className="detail-column">
                                <p><strong>Number Plate:</strong> <span className="Number">{vehicle.number_plate}</span></p>
                                <p><strong>Last Service:</strong> {vehicle.last_service_date || 'N/A'}</p>
                            </div>
                            <div className="action-buttons">
                                <button onClick={() => navigate("/service-management")}>Service</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Vehicle Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Add New Vehicle</h2>
                        <form onSubmit={handleSubmit}>
                            {['make', 'model', 'year', 'number_plate'].map((field) => (
                                <div key={field} className="form-group">
                                    <label>{field.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}</label>
                                    <input
                                        type={field === 'year' ? 'number' : 'text'}
                                        name={field}
                                        value={newVehicle[field]}
                                        onChange={handleInputChange}
                                        placeholder={`e.g. ${field === 'make' ? 'Toyota' : field === 'model' ? 'Camry' : field === 'year' ? '2023' : 'KDN1234G'}`}
                                        required
                                    />
                                </div>
                            ))}
                            
                            <div className="form-group">
                                <label>Last Service Date</label>
                                <input
                                    type="date"
                                    name="last_service_date"
                                    value={newVehicle.last_service_date}
                                    onChange={handleInputChange}
                                />
                            </div>
                            
                            <div className="modal-actions">
                                <button 
                                    type="button" 
                                    className="cancel-button"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="submit-button"
                                >
                                    Add Vehicle
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarDetails;