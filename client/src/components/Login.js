"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  // const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      const response = await fetch('https://culserv.onrender.com/login', {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
        credentials: 'include' // Important for cookies/sessions
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }
  
      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/car-details");
    } catch (err) {
      setError(err.message || "Invalid email or password");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="form-wrapper">
        <div className="form-card">
          <h2>Login</h2>
          <p className="subtitle">Sign in to manage your vehicles and services</p>

          {error && <p className="error-message">{error}</p>}

          <form className="login-form" onSubmit={handleLogin}>
          <label className="label-all">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={loginData.email}
              onChange={handleChange}
              required
            />
            <label className="label-all">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleChange}
              required
            />
            <button className="login-btn" type="submit" disabled={loading}>{loading ? "Loading..." : "Login"}</button>

            {/* <div className="checkbox-container">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="rememberMe">Remember me for 30 days</label>
            </div> */}


            {/* Signup Link */}
            <p className="signup-link">
              Don't have an account? <a href="/register-client">Sign Up</a>
            </p>
          </form>
        </div>
      </div>
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
          <h1>Welcome Back to CulServ</h1>
          <p>Log in to access your vehicle service management dashboard and continue managing your operations.</p>
        </div>

        <div className="features-list">
          <div className="feature-item">
            <div className="circle-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
                <path
                  d="M8 12L11 15L16 9"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="feature-text">
              <h3>Easy Registration</h3>
              <p>Register clients in seconds</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="circle-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
                <path
                  d="M8 12L11 15L16 9"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="feature-text">
              <h3>Client Management</h3>
              <p>Keep track of all your clients</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="circle-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
                <path
                  d="M8 12L11 15L16 9"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="feature-text">
              <h3>Service History</h3>
              <p>Complete service records</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
