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
        current_mileage: '',
        last_service_date: ''
    });

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch('/vehicles', {
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    if (response.status === 401) {
                        navigate('/login');
                        return;
                    }
                    throw new Error('Failed to fetch vehicles');
                }
                
                const data = await response.json();
                setVehicles(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchVehicles();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewVehicle(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!user || !user.id) {
            setError('User not logged in');
            return;
        }

        try {
            const response = await fetch('/vehicles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    client_id: user.id,
                    make: newVehicle.make,
                    model: newVehicle.model,
                    year: newVehicle.year,
                    number_plate: newVehicle.number_plate,
                    current_mileage: newVehicle.current_mileage,
                    last_service_date: newVehicle.last_service_date
                }),
                credentials: 'include'
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add vehicle');
            }
    
            const addedVehicle = await response.json();
            setVehicles(prev => [...prev, addedVehicle]);
            setShowModal(false);
    
            setNewVehicle({
                make: '',
                model: '',
                year: '',
                number_plate: '',
                current_mileage: '',
                last_service_date: ''
            });
        } catch (err) {
            setError(err.message);
        }
    };

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

    const getVehicleCount = (status) => {
        if (status === 'All Vehicles') return vehicles.length;
        if (status === 'Service Due') return vehicles.filter(v => v.serviceDue).length;
        if (status === 'Needs Attention') return vehicles.filter(v => v.needsAttention).length;
        return 0;
    };

    const getStatusLabel = (vehicle) => {
        if (vehicle.serviceDue) return 'Service Due';
        if (vehicle.needsAttention) return 'Needs Attention';
        return 'Good Condition';
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
                    <button 
                        className={filter === 'All Vehicles' ? 'active' : ''}
                        onClick={() => setFilter('All Vehicles')}
                    >
                        All Vehicles ({getVehicleCount('All Vehicles')})
                    </button>
                    <button 
                        className={filter === 'Service Due' ? 'active' : ''}
                        onClick={() => setFilter('Service Due')}
                    >
                        Service Due ({getVehicleCount('Service Due')})
                    </button>
                    <button 
                        className={filter === 'Needs Attention' ? 'active' : ''}
                        onClick={() => setFilter('Needs Attention')}
                    >
                        Needs Attention ({getVehicleCount('Needs Attention')})
                    </button>
                </div>
            </div>
            
            <div className="vehicle-list">
                {filteredVehicles.map(vehicle => (
                    <div key={vehicle.id} className="vehicle-card">
                        <div className="vehicle-header">
                            <h3>{vehicle.make} {vehicle.model} ({vehicle.year})</h3>
                            <span className="Number">{vehicle.number_plate}</span>
                        </div>
                        
                        <div className="vehicle-details">
                            <div className="detail-column">
                                <p><strong>Last Service:</strong> {vehicle.last_service_date || 'N/A'}</p>
                                {vehicle.mileage && <p><strong>Mileage:</strong> {vehicle.mileage.toLocaleString()} miles</p>}
                            </div>
                            <div className="detail-column">
                                <p><strong>Next Due:</strong> {vehicle.next_service_date || 'N/A'}</p>
                            </div>
                        </div>
                        
                        <div className="vehicle-actions">
                            <button className={`status-tag ${getStatusLabel(vehicle).toLowerCase().replace(' ', '-')}`}>
                                {getStatusLabel(vehicle)}
                            </button>
                            <div className="action-buttons">
                                <button>History</button>
                                <button>Service</button>
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
                            <div className="form-group">
                                <label>Make</label>
                                <input
                                    type="text"
                                    name="make"
                                    value={newVehicle.make}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Toyota"
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Model</label>
                                <input
                                    type="text"
                                    name="model"
                                    value={newVehicle.model}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Camry"
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Year</label>
                                <input
                                    type="text"
                                    name="year"
                                    value={newVehicle.year}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 2023"
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Number Plate</label>
                                <input
                                    type="text"
                                    name="number_plate"
                                    value={newVehicle.number_plate}
                                    onChange={handleInputChange}
                                    placeholder="e.g. KDN1234G"
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Current Mileage</label>
                                <input
                                    type="number"
                                    name="mileage"
                                    value={newVehicle.mileage}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 25000"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Last Service Date</label>
                                <input
                                    type="date"
                                    name="last_service_date"
                                    value={newVehicle.last_service_date}
                                    onChange={handleInputChange}
                                    placeholder="mm/dd/yyyy"
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
