import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">CulServ</div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/register-client">Register Client</Link></li>
        <li><Link to="/car-details">Car Details</Link></li>
        <li><Link to="/service-management">Service Management</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
