import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Change useHistory to useNavigate
import "./Homepage.css"; // Import the CSS file

function Homepage() {
  const navigate = useNavigate(); // ✅ Use useNavigate instead of useHistory

  return (
    <div className="homepage">
      <div className="content">
        <h1>Welcome to <span className="highlight">CulServ!</span></h1>
        <p>
          We're your partner in keeping your vehicles running smoothly.  
          Our platform helps you effectively manage service needs,  
          optimize maintenance, and reduce downtime.
        </p>
        <button onClick={() => navigate("/register-client")}>Get Started</button> {/* ✅ Fixed */}
      </div>
    </div>
  );
}

export default Homepage;
