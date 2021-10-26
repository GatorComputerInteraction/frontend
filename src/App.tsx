import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { browserHistory } from "./state";

import Schedule from "./pages/Schedule";
import { AppBar, Box, Container, Toolbar, Typography } from "@material-ui/core";

// Construct React Router and any globally shared elements (such as a toolbar)
export default () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <ConnectedRouter history={browserHistory}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h4">ONE.UF</Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" style={{ marginTop: "1em" }}>
          <Switch>
            <Route exact path="/" children={<Schedule />} />
          </Switch>
        </Container>
      </ConnectedRouter>
    </Box>
  );
};
