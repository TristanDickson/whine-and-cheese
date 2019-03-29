import { MuiThemeProvider } from "@material-ui/core";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import MenuAppBar from "./MenuAppBar";
import registerServiceWorker from "./registerServiceWorker";
import Tabs from "./Tabs";
import theme from "./Theme";
import withAuth from "./withAuth";
import Login from "./Login";
import Rate from "./Rate";
import CodeNotFound from "./CodeNotFound";
import RadarChart from "./RadarChart";

function GoToLogin() {
  return <Redirect to="/login" />
}

function Config(props) {
  return (
    <div>
      <MenuAppBar {...props}/>
      <Tabs />
    </div>
  );
}

class App extends Component {
  render() {
    return (
      <Router>
        <MuiThemeProvider theme={theme}>
          <Switch>
            <Route path="/" exact component={GoToLogin} />
            <Route path="/login" component={Login} />
            <Route path="/config" component={withAuth(Config)} />
            <Route path="/rate" component={Rate} />
            <Route path="/codeNotFound" component={CodeNotFound} />
            <Route path="/radar" component={RadarChart} />
          </Switch>
        </MuiThemeProvider>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));

registerServiceWorker();
