import { MuiThemeProvider, CssBaseline } from "@material-ui/core";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import MenuAppBar from "./MenuAppBar";
import registerServiceWorker from "./registerServiceWorker";
import theme from "./Theme";
import withAuth from "./withAuth";
import Login from "./Whine/Login/Login";
import Tabs from "./Whine/Config/Tabs";
import Rate from "./Whine/Rate/Rate";
import CodeNotFound from "./Whine/Rate/CodeNotFound";
import WineResults from "./Whine/Results/Results";
import FilmResults from "./Film/FilmResults";

function GoToLogin() {
  return <Redirect to="/login" />;
}

function Config(props) {
  return (
    <div>
      <MenuAppBar {...props} />
      <Tabs />
    </div>
  );
}

class App extends Component {
  render() {
    return (
      <Router>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Switch>
            <Route path="/" exact component={GoToLogin} />
            <Route path="/login" component={Login} />
            <Route path="/config" component={withAuth(Config)} />
            <Route path="/rate" component={Rate} />
            <Route path="/codeNotFound" component={CodeNotFound} />
            <Route path="/results" component={WineResults} />
            <Route path="/film-results" component={FilmResults} />
          </Switch>
        </MuiThemeProvider>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));

registerServiceWorker();
