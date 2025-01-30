import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./RegisterClient.css";

function RegisterClient() {
  const history = useHistory(); // Correct usage in React Router v5
  const [formData, setFormData] = useState({ name: "", email: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Client Data:", formData);
    history.push("/car-details"); // Correct usage in React Router v5
  };

  return (
    <div className="register-page">
      {/* Navbar */}
      <div className="navbar">
        <span className="logo">CulServ</span>
        <span className="nav-link" onClick={() => history.push("/")}>Home</span> {/* Fix */}
      </div>

      {/* Registration Form */}
      <div className="form-container">
        <div className="form-header">Register Client Here</div>
        <form onSubmit={handleSubmit}>
          <label>Names:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <button type="submit">Submit</button>
        </form>
      </div>

      {/* Already Registered? */}
      <p className="registered-text">
        If already registered: 
        <span onClick={() => history.push("/car-details")} className="link"> Car Details</span> {/* Fix */}
      </p>
    </div>
  );
}

export default RegisterClient;
