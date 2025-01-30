import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import RegisterClient from "./RegisterClient";
import CarDetails from "./CarDetails";
import ServiceManagement from "./ServiceManagement";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register-client" element={<RegisterClient />} />
        <Route path="/car-details" element={<CarDetails />} />
        <Route path="/service-management" element={<ServiceManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
