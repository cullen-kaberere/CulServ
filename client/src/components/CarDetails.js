import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./CarDetails.css"; // Import the CSS file

function CarDetails() {
  const history = useHistory();
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    clientId: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Car Details:", formData);
    history.push("/service-management"); // Redirect to Service Management Page
  };

  return (
    <div className="car-details-page">
      {/* Navbar */}
      <div className="navbar">
        <span className="logo">CulServ</span>
        <span className="nav-link" onClick={() => history.push("/")}>
          Home
        </span>
      </div>

      {/* Form Container */}
      <div className="form-container">
        <div className="form-header">Add Car Details Here</div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Make:</label>
            <input
              type="text"
              name="make"
              value={formData.make}
              onChange={handleChange}
              required
            />

            <label>Model:</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Year:</label>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
            />

            <label>ID:</label>
            <input
              type="text"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>

      {/* Already Uploaded? */}
      <p className="uploaded-text">
        If already uploaded car detail:{" "}
        <span onClick={() => history.push("/service-management")} className="link">
          Service page
        </span>
      </p>
    </div>
  );
}

export default CarDetails;
