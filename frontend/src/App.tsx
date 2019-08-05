import { MuiThemeProvider, CssBaseline } from "@material-ui/core";
import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import theme from "./Theme";

import withAuth from "./withAuth";

import Login from "./Whine/Login/Login";
import Register from "./Whine/Login/Register";
import Rate from "./Whine/Rate/Rate";
import CodeNotFound from "./Whine/Rate/CodeNotFound";
import Results from "./Whine/Results/Results";
import ItemConfig from "./Whine/Config/ItemConfig";
import SetConfig from "./Whine/Config/SetConfig";

import { connect } from "react-redux";
import {
  fetchParticipants,
  fetchSubjects,
  fetchQuestions,
  fetchSets,
  fetchSetsParticipants,
  fetchSetsSubjects,
  fetchSetsQuestions
} from "./State/actions";
import GeneralConfig from "./Whine/Config/GeneralConfig";

interface Props {
  fetchParticipants(): void;
  fetchSubjects(): void;
  fetchQuestions(): void;
  fetchSets(): void;
  fetchSetsParticipants(): void;
  fetchSetsSubjects(): void;
  fetchSetsQuestions(): void;
}

class App extends Component<Props> {
  componentDidMount() {
    console.log(process.env.REACT_APP_BACKEND_URL);
    this.props.fetchParticipants();
    this.props.fetchSubjects();
    this.props.fetchQuestions();
    this.props.fetchSets();
    this.props.fetchSetsParticipants();
    this.props.fetchSetsSubjects();
    this.props.fetchSetsQuestions();
  }

  render() {
    return (
      <Router>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Switch>
            <Route
              path="/"
              exact
              component={() => <Redirect to="/item_config" />}
            />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/item_config" component={withAuth(ItemConfig)} />
            <Route path="/set_config" component={withAuth(SetConfig)} />
            <Route path="/general_config" component={withAuth(GeneralConfig)} />
            <Route path="/rate" component={Rate} />
            <Route path="/codeNotFound" component={CodeNotFound} />
            <Route path="/results" component={Results} />
          </Switch>
        </MuiThemeProvider>
      </Router>
    );
  }
}

const mapDispatchToProps = {
  fetchParticipants,
  fetchSubjects,
  fetchQuestions,
  fetchSets,
  fetchSetsParticipants,
  fetchSetsSubjects,
  fetchSetsQuestions
};

export default connect(
  null,
  mapDispatchToProps
)(App);
