import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import SettingsIcon from "@material-ui/icons/Settings";
import ResultsIcon from "@material-ui/icons/BarChart";

const styles = theme => ({
  drawerPaper: {
    [theme.breakpoints.up("xs")]: {
      top: 56
    },
    [theme.breakpoints.up("md")]: {
      top: 60
    },
    [theme.breakpoints.up("lg")]: {
      top: 64
    },
    width: 320
  },
  listItem: {
    width: 240,
    display: "inline-flex"
  }
});

class NavDrawer extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <Drawer
        variant="temporary"
        anchor="left"
        open={this.props.open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <ListItem
          className={classes.listItem}
          button
          onClick={() => this.props.history.push("/config")}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Config" />
        </ListItem>
        <ListItem
          className={classes.listItem}
          button
          onClick={() => this.props.history.push("/results")}
        >
          <ListItemIcon>
            <ResultsIcon />
          </ListItemIcon>
          <ListItemText primary="Results" />
        </ListItem>
      </Drawer>
    );
  }
}

NavDrawer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NavDrawer);
