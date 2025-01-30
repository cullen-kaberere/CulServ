import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from "./HomePage";  // Ensure this matches the actual file name
import RegisterClient from "./RegisterClient";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/register-client" component={RegisterClient} />
      </Switch>
    </Router>
  );
}

export default App;
