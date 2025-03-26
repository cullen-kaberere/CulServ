"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterClient.css";

const RegisterClient = () => {
  const navigate = useNavigate();
  const [clientData, setClientData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    setClientData({ ...clientData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await fetch("https://culserv.onrender.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      });

      if (response.ok) {
        navigate("/login");
      } else {
        console.error("Failed to sign up client");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="register-container">
      <div className="sidebar">
        <div className="logo-section">
          <div className="car-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"
                fill="white"
              />
            </svg>
          </div>
          <h1>Join CulServ</h1>
          <p>Vehicle Service Management</p>
        </div>
      </div>

      <div className="form-wrapper">
        <div className="form-cardi">
          <h2>Create an Account</h2>
          <p className="subtitle">Sign up to get started with CulServ</p>

          <form className="signup-f" onSubmit={handleSignup}>
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={clientData.name}
              onChange={handleChange}
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={clientData.email}
              onChange={handleChange}
              required
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              value={clientData.password}
              onChange={handleChange}
              required
            />
            <p className="login-links">
              Already have an account? <a href="/login">Login</a>
            </p>

            <button className="register-btn" type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterClient;
