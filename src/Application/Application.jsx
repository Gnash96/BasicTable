import React from "react";
import { Router } from "react-router-dom";

import ContentArea from "../Route";
import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

export default () => {
  return (
    <React.Fragment>
      <Router history={history}>
        <ContentArea />
      </Router>
    </React.Fragment>
  );
};
