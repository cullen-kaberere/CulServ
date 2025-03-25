import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Change useHistory to useNavigate
import "./Homepage.css"; // Import the CSS file
 import { Calendar, Car, ClipboardCheck, BarChart, Clock, Truck} from "lucide-react"

function Homepage() {
  const navigate = useNavigate(); // ✅ Use useNavigate instead of useHistory

  return (
    <> {/* React Fragment to wrap adjacent elements */}
      <section className="home-section">
        <div className="homepage">
          <div className="content">
            <h1>Welcome to <span className="highlight">CulServ!</span></h1>
            <p>
              We're your partner in keeping your vehicles running smoothly.  
              Our platform helps you effectively manage service needs,  
              optimize maintenance, and reduce downtime.
            </p>
            <button className="btn-ready" onClick={() => navigate("/register-client")}>Get Started</button> {/* ✅ Fixed */}
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="service py-5">
        <div className="container">
          <h1 className="text-center mb-4 fw-bold">Our Services</h1>
          <p className="text-center text-muted">
            Comprehensive vehicle maintenance and service management solutions to keep your fleet in top condition.
          </p>

          <div className="row g-4 mt-4">
            {/* Service Card 1 */}
            <div className="col-md-4">
              <div className="card shadow-sm border-0 text-center p-4">
                <Calendar size={40} className="text-warning mx-auto mb-3" />
                <h5 className="fw-bold">Maintenance Scheduling</h5>
                <p className="text-muted">
                  Plan and schedule regular maintenance for your vehicles to prevent breakdowns.
                </p>
              </div>
            </div>

            {/* Service Card 2 */}
            <div className="col-md-4">
              <div className="card shadow-sm border-0 text-center p-4">
                <Car size={40} className="text-warning mx-auto mb-3" />
                <h5 className="fw-bold">Vehicle Tracking</h5>
                <p className="text-muted">
                  Keep detailed records of all your vehicles, eg service history and upcoming needs.
                </p>
              </div>
            </div>

            {/* Service Card 3 */}
            <div className="col-md-4">
              <div className="card shadow-sm border-0 text-center p-4">
                <ClipboardCheck size={40} className="text-warning mx-auto mb-3" />
                <h5 className="fw-bold">Service Management</h5>
                <p className="text-muted">
                  Manage all service requests, track progress, and ensure timely completion of work.
                </p>
                </div>
              </div>
            </div>
          </div>
      </section>

      {/* Why Choose CulServ Section */}
      <section className="why-choose py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="fw-bold">Why Choose CulServ?</h1>
              <p className="text-muted">
                Our comprehensive vehicle service management platform is designed to streamline your maintenance operations and reduce costs.
              </p>
              <div className="d-flex align-items-start mb-3">
                <BarChart size={30} className="text-warning me-3" />
                <div>
                  <h5 className="fw-bold">Increased Efficiency</h5>
                  <p className="text-muted">Streamline your service operations and reduce administrative overhead.</p>
                </div>
              </div>
              <div className="d-flex align-items-start mb-3">
                <Clock size={30} className="text-warning me-3" />
                <div>
                  <h5 className="fw-bold">Reduced Downtime</h5>
                  <p className="text-muted">Proactive maintenance scheduling helps prevent unexpected breakdowns.</p>
                </div>
              </div>
              <div className="d-flex align-items-start mb-3">
                <Truck size={30} className="text-warning me-3" />
                <div>
                  <h5 className="fw-bold">Extended Vehicle Life</h5>
                  <p className="text-muted">Regular maintenance extends the operational life of your vehicles.</p>
                </div>
              </div>
              {/* <button className="btn btn-warning">Learn More</button> */}
            </div>
            <div className="col-md-6">
              <div className="placeholder-image bg-light d-flex align-items-center justify-content-center">
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Optimize Section */}
      <section className="ready-optimize py-5 bg-orange text-white text-center">
        <div className="container">
          <h2 className="fw-bold">Ready to optimize your vehicle management?</h2>
          <p>Join thousands of satisfied customers who have transformed their vehicle maintenance operations with CulServ.</p>
          <button className="btn-ready" onClick={() => navigate("/register-client")}>Get Started Today</button>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h4 className="fw-bold"><span className="text-orange">CulServ</span></h4>
              <p className="text-muted">Your trusted partner for vehicle service management and maintenance optimization.</p>
            </div>
            <div className="col-md-2">
              <h6 className="fw-bold">Quick Links</h6>
              <ul className="list-unstyled">
                <li><a href="/HomePage" className="footer-link">Home</a></li>
                <li><a href="/register-client" className="footer-link">Register Client</a></li>
                <li><a href="/car-details" className="footer-link">Car Details</a></li>
                <li><a href="/ServiceManagement" className="footer-link">Service Managent</a></li>
              </ul>
            </div>
            <div className="col-md-2">
              <h6 className="fw-bold">Features</h6>
              <ul className="list-unstyled">
                <li><h7>Maintenance Scheduling</h7></li>
                <li><h7>Vehicle Tracking</h7></li>
                <li><h7>Reporting & Analytics</h7></li>
                <li><h7>Service Management</h7></li>
              </ul>
            </div>
            <div className="col-md-2">
              <h6 className="fw-bold">Contact Us</h6>
              <ul className="list-unstyled">
                <li><h7>Email: info@culserv.com</h7></li>
                <li><h7>Phone: (123) 456-7890</h7></li>
                <li><h7>Address: 123 Service St, Automotive City</h7></li>
              </ul>
            </div>
          </div>
          <hr />
          <p className="text-center text-muted">© 2025 CulServ. All rights reserved.</p>
        </div>
      </footer>
      
    </>
  );
}

export default Homepage;
