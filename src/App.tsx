import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { browserHistory } from "./state";

import Schedule from "./pages/Schedule";

// Construct React Router and any globally shared elements (such as a toolbar)
export default () => {
  return (
    <ConnectedRouter history={browserHistory}>
      <Switch>
        <Route exact path="/" children={<Schedule />} />
      </Switch>
    </ConnectedRouter>
  );
};
