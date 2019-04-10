import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ResultsAppBar from "./ResultsAppBar";
import RadarChart from "./RadarChart";

const styles = theme => ({
  root: {
  }
});

class Results extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <ResultsAppBar />
        <RadarChart />
      </div>
    );
  }
}

Results.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Results);
