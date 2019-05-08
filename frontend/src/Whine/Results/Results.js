import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "./AppBar";
import Body from "./Body";

const styles = theme => ({
  root: {}
});

class FilmResults extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar />
        <Body />
      </div>
    );
  }
}

FilmResults.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FilmResults);
