import React from "react";
import { Route, Switch } from "react-router-dom";
import PageOne from "./Components/PageOne";
import PageTwo from "./Components/PageTwo";

export default () => {
  return (
    <Switch>
      <Route exact path={"/chart"} component={PageOne} />
      <Route exact path={"/queryToClip"} component={PageTwo} />
    </Switch>
  );
};
