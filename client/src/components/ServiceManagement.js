import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./ServiceManagement.css";

function ServiceManagement() {
  const history = useHistory();
  const [mechanics, setMechanics] = useState([]);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    mechanicId: "",
  });

  // Fetch mechanics from API (Replace with actual endpoint)
  useEffect(() => {
    fetch("/api/mechanics") // Example API call
      .then((res) => res.json())
      .then((data) => setMechanics(data));
  }, []);

  // Fetch existing services (Replace with actual endpoint)
  useEffect(() => {
    fetch("/api/services") // Example API call
      .then((res) => res.json())
      .then((data) => setServices(data));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Service:", formData);
    // Send service data to API (Replace with actual endpoint)
    fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }).then(() => history.push("/")); // Redirect or update UI
  };

  return (
    <div className="service-management">
      {/* Navbar */}
      <div className="navbar">
        <span className="logo">CulServ</span>
        <span className="nav-link" onClick={() => history.push("/")}>Home</span>
      </div>

      {/* Form Section */}
      <div className="form-container">
        <div className="form-header">Add Car Details Here</div>
        <form onSubmit={handleSubmit}>
          <label>Service Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <label>Select Mechanic:</label>
          <select name="mechanicId" value={formData.mechanicId} onChange={handleChange} required>
            <option value="">Select Mechanic</option>
            {mechanics.map((mech) => (
              <option key={mech.id} value={mech.id}>{mech.name}</option>
            ))}
          </select>

          <button type="submit">Submit</button>
        </form>
      </div>

      {/* Search & Services Table */}
      <div className="services-section">
        <button className="search-btn">Search</button>
        <div className="services-table">
          <table>
            <thead>
              <tr>
                <th>Names</th>
                <th>Vehicle Make and Model</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr key={index}>
                  <td>{service.clientName}</td>
                  <td>{service.vehicleMake}, {service.vehicleModel}</td>
                  <td>{service.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ServiceManagement;
