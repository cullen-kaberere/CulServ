import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignInAlt, FaUserPlus, FaUserCircle } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const storedUser = localStorage.getItem("user");
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brandi">CulServ</div>
      <div className="navbar-auth">
        {user ? (
          <div className="user-menu" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <FaUserCircle className="icon" /> {user.name}
            <div className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" className="login-link">
              <FaSignInAlt className="icon" /> Login
            </Link>
            <Link to="/register-client" className="signup-button">
              <FaUserPlus className="icon" /> Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
