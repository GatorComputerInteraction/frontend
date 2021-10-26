import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { store } from "./state";
import { Provider } from "react-redux";
import { ThemeProvider } from "@material-ui/core";

import { theme } from "./theme";

// Render React ROM and create Redux State.
ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);
