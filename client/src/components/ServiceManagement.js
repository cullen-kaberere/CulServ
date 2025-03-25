import { useState, useEffect, useMemo } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import "./ServiceManagement.css"

const ServiceManagement = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [selectedServices, setSelectedServices] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [totalPrice, setTotalPrice] = useState(0)

  // Service packages with descriptions and prices (memoized)
  const servicePackages = useMemo(() => [
    {
      id: 1,
      name: "Basic Maintenance",
      description: "Oil change, filter replacement, fluid check, and basic inspection",
      price: 7999,
      estimatedTime: "1-2 hours",
      icon: "oil-change.png",
      includes: [
        "Oil and filter change",
        "Fluid level check and top-up",
        "Tire pressure check",
        "Basic safety inspection",
        "Battery check",
      ],
    },
    {
      id: 2,
      name: "Full Service",
      description: "Comprehensive vehicle maintenance including all fluids, filters, and detailed inspection",
      price: 11999,
      estimatedTime: "3-4 hours",
      icon: "full-service.png",
      includes: [
        "Everything in Basic Maintenance",
        "Air filter replacement",
        "Cabin filter replacement",
        "Spark plug check",
        "Brake inspection",
        "Suspension check",
        "Exhaust system inspection",
        "Detailed diagnostic scan",
      ],
    },
    {
      id: 3,
      name: "Brake Service",
      description: "Complete brake system inspection, pad replacement, and rotor resurfacing if needed",
      price: 4900,
      estimatedTime: "2-3 hours",
      icon: "brake-service.png",
      includes: [
        "Brake pad replacement",
        "Brake fluid flush",
        "Rotor inspection and resurfacing",
        "Caliper inspection",
        "Brake line inspection",
        "Test drive and adjustment",
      ],
    },
  ], []) // Empty dependency array means this only gets calculated once

  // Fetch vehicle details if coming from vehicle selection
  useEffect(() => {
    const fetchVehicleDetails = async () => {
      // Check if we have a vehicle ID in the URL or state
      const params = new URLSearchParams(location.search)
      const vehicleId = params.get("vehicleId")

      if (vehicleId) {
        setLoading(true)
        try {
          const response = await fetch(`/vehicles/${vehicleId}`, {
            credentials: "include",
          })

          if (!response.ok) {
            throw new Error("Failed to fetch vehicle details")
          }

          const data = await response.json()
          setSelectedVehicle(data)
        } catch (err) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      } else {
        // For demo purposes, set a mock vehicle
        setSelectedVehicle({
          id: 1,
          make: "Toyota",
          model: "Camry",
          year: "2020",
          number_plate: "KDN1234G",
          current_mileage: 25000,
          last_service_date: "2023-05-15",
        })
        setLoading(false)
      }
    }

    fetchVehicleDetails()
  }, [location])

  // Calculate total price whenever selected services or servicePackages change
  useEffect(() => {
    const newTotal = selectedServices.reduce((sum, serviceId) => {
      const service = servicePackages.find((pkg) => pkg.id === serviceId)
      return sum + (service ? service.price : 0)
    }, 0)

    setTotalPrice(newTotal)
  }, [selectedServices, servicePackages]) // Added servicePackages to dependencies

  const handleServiceToggle = (serviceId) => {
    setSelectedServices((prev) => {
      if (prev.includes(serviceId)) {
        return prev.filter((id) => id !== serviceId)
      } else {
        return [...prev, serviceId]
      }
    })
  }

  const handleCheckout = async () => {
    if (!selectedVehicle) {
      setError("Please select a vehicle first")
      return
    }

    if (selectedServices.length === 0) {
      setError("Please select at least one service")
      return
    }

    try {
      const serviceDetails = selectedServices.map((serviceId) => {
        const service = servicePackages.find((pkg) => pkg.id === serviceId)
        return {
          service_id: serviceId,
          name: service.name,
          price: service.price,
        }
      })

      // In a real app, you would create a service request here
      // For demo purposes, we'll just navigate to checkout
      navigate(`/checkout?requestId=123&services=${JSON.stringify(serviceDetails)}&totalPrice=${totalPrice}`)
    } catch (err) {
      setError(err.message)
    }
  }
  useEffect(() => {
    const newTotal = selectedServices.reduce((sum, serviceId) => {
      const service = servicePackages.find((pkg) => pkg.id === serviceId)
      return sum + (service ? service.price : 0)
    }, 0)

    setTotalPrice(newTotal)
  }, [selectedServices, servicePackages])
  if (loading)
    return (
      <div className="service-management-container loading-container">
        <div className="loading-spinner"></div>
        <p>Loading service options...</p>
      </div>
    )

  return (
    <div className="service-management-container">
      <div className="service-header">
        <h1>Service Management</h1>
        <p className="service-subtitle">Select service packages for your vehicle</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {selectedVehicle && (
        <div className="selected-vehicle">
          <div className="vehicle-card">
            <div className="vehicle-icon">
              <i className="vehicle-icon-placeholder">🚗</i>
            </div>
            <div className="vehicle-details">
              <h2>
                {selectedVehicle.make} {selectedVehicle.model}
              </h2>
              <div className="vehicle-info-grid">
                <div className="vehicle-info-item">
                  <span className="info-label">Year:</span>
                  <span className="info-value">{selectedVehicle.year}</span>
                </div>
                <div className="vehicle-info-item">
                  <span className="info-label">Number Plate:</span>
                  <span className="info-value number-plate">{selectedVehicle.number_plate}</span>
                </div>
                <div className="vehicle-info-item">
                  <span className="info-label">Mileage:</span>
                  <span className="info-value">{selectedVehicle.current_mileage?.toLocaleString() || "N/A"} miles</span>
                </div>
                <div className="vehicle-info-item">
                  <span className="info-label">Last Service:</span>
                  <span className="info-value">{selectedVehicle.last_service_date || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="service-packages-section">
        <h2>Available Service Packages</h2>
        <p className="section-description">Choose the service packages that best fit your vehicle's needs</p>

        <div className="packages-grid">
          {servicePackages.map((service) => (
            <div
              key={service.id}
              className={`service-card ${selectedServices.includes(service.id) ? "selected" : ""}`}
              onClick={() => handleServiceToggle(service.id)}
            >
              <div className="service-badge">
                {service.name === "Basic Maintenance" && <span className="service-icon">🔧</span>}
                {service.name === "Full Service" && <span className="service-icon">⚙️</span>}
                {service.name === "Brake Service" && <span className="service-icon">🛑</span>}
              </div>

              <div className="service-header">
                <h3>{service.name}</h3>
                <div className="service-price">Ksh{service.price.toFixed(2)}</div>
              </div>

              <p className="service-description">{service.description}</p>

              <div className="service-details">
                <div className="estimated-time">
                  <span className="time-icon">⏱️</span>
                  <span>{service.estimatedTime}</span>
                </div>

                <div className="service-includes">
                  <h4>This service includes:</h4>
                  <ul>
                    {service.includes.map((item, index) => (
                      <li key={index}>
                        <span className="check-icon">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="service-select">
                <div className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    id={`service-${service.id}`}
                    checked={selectedServices.includes(service.id)}
                    onChange={() => {}} // Handled by the onClick on the card
                    className="service-checkbox"
                  />
                  <label htmlFor={`service-${service.id}`} className="checkbox-label">
                    {selectedServices.includes(service.id) ? "Selected" : "Select this package"}
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="service-summary">
        <div className="summary-content">
          <h2>Service Summary</h2>

          {selectedServices.length > 0 ? (
            <div className="summary-details">
              <div className="selected-services-list">
                {selectedServices.map((serviceId) => {
                  const service = servicePackages.find((pkg) => pkg.id === serviceId)
                  return (
                    <div key={serviceId} className="summary-item">
                      <div className="service-info">
                        <span className="service-name">{service.name}</span>
                        <span className="service-time">{service.estimatedTime}</span>
                      </div>
                      <span className="service-price">Ksh{service.price.toFixed(2)}</span>
                    </div>
                  )
                })}
              </div>

              <div className="total-price">
                <span>Total:</span>
                <span className="price">Ksh{totalPrice.toFixed(2)}</span>
              </div>

              <div className="summary-actions">
                <button className="back-button" onClick={() => navigate("/car-details")}>
                  Back to Vehicles
                </button>

                <button
                  className="checkout-button"
                  onClick={handleCheckout}
                  disabled={!selectedVehicle || selectedServices.length === 0}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-summary">
              <div className="empty-icon">🔍</div>
              <p>No services selected yet</p>
              <p className="empty-description">Please select at least one service package to continue</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ServiceManagement