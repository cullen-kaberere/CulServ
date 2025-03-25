import React from "react";
import { Link } from "react-router-dom";
import { FaCar, FaTools, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brandi">CulServ</div>
      
      <div className="navbar-auth">
        <Link to="/login" className="login-link">
          <FaSignInAlt className="icon" /> Login
        </Link>
        <Link to="/register-client" className="signup-button">
          <FaUserPlus className="icon" /> Signup
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
