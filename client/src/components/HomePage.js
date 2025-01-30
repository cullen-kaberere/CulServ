import React from "react";
import { useHistory } from "react-router-dom";
import "./Homepage.css"; // Import the CSS file

function Homepage() {
    const history = useHistory();

  return (
    <div className="homepage">
      <nav className="navbar">CulServ</nav>
      <div className="content">
        <h1>Welcome to <span className="highlight">CulServ!</span></h1>
        <p>
          We're your partner in keeping your vehicles running smoothly.  
          Our platform helps you effectively manage service needs,  
          optimize maintenance, and reduce downtime.
        </p>
        <button onClick={() => history.push("/register-client")}>Start</button>
      </div>
    </div>
  );
}

export default Homepage;
