import { MuiThemeProvider, CssBaseline } from "@material-ui/core";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import registerServiceWorker from "./registerServiceWorker";
import unregister from "./registerServiceWorker";
import theme from "./Theme";
import withAuth from "./withAuth";
import Login from "./Whine/Login/Login";
import Register from "./Whine/Login/Register";
import Rate from "./Whine/Rate/Rate";
import CodeNotFound from "./Whine/Rate/CodeNotFound";
import WineResults from "./Whine/Results/Results";
import Config from "./Whine/Config/Config";
import FilmResults from "./Film/FilmResults";

function GoToLogin() {
  return <Redirect to="/config" />;
}

class App extends Component {
  render() {
    console.log(process.env.REACT_APP_BACKEND_URL);

    return (
      <Router>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Switch>
            <Route path="/" exact component={GoToLogin} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
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

unregister();
//registerServiceWorker();
