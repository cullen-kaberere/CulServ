import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCar, FaTools, FaSignInAlt, FaUserPlus, FaUser, FaSignOutAlt } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch user data from localStorage or your authentication system
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user session
    setUser(null);
    setDropdownOpen(false);
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">CulServe</div>
      <ul className="navbar-links">
        <li>
          <Link to="/car-details">
            <FaCar className="icon" /> Car Details <span className="dropdown-arrow">▾</span>
          </Link>
        </li>
        <li>
          <Link to="/services">
            <FaTools className="icon" /> Services <span className="dropdown-arrow">▾</span>
          </Link>
        </li>
      </ul>
      <div className="navbar-auth">
        {user ? (
          <div className="user-menu">
            <button className="user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <FaUser className="icon" /> {user.name}
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={handleLogout}>
                  <FaSignOutAlt className="icon" /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="login-link">
              <FaSignInAlt className="icon" /> Login
            </Link>
            <Link to="/signup" className="signup-button">
              <FaUserPlus className="icon" /> Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
