import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Schedule from "./pages/Schedule";

export default () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" children={<Schedule />} />
      </Switch>
    </Router>
  );
};
