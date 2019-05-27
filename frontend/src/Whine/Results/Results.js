import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "../Config/AppBar";
import Body from "./Body";

const styles = theme => ({
  root: {}
});

class Results extends Component {
  constructor() {
    super();
    this.state = {};
  }

  toggleOpen = () => {
    this.setState({open: !this.state.open});
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar history={this.props.history} open={this.state.open} toggleOpen={this.toggleOpen}/>
        <Body />
      </div>
    );
  }
}

Results.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Results);
