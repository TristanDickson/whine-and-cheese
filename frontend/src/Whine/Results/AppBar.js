import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
//import AppBarMenu from "./AppBarMenu";

const styles = {
  root: {
    width: "100%"
  },
  title: {
    paddingRight: "20px"
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

//let wines = ["Wine 1", "Wine 2", "Wine 3"];
//let people = ["Person 1", "Person 2", "Person 3"];

class WineAppBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null
    };
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={this.handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant="h6" color="inherit">
              Whine & Cheese
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

WineAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(WineAppBar);
