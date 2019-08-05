import React, { Component } from "react";
import { withStyles, createStyles, WithStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import SettingsIcon from "@material-ui/icons/Settings";
import ResultsIcon from "@material-ui/icons/BarChart";
import DashboardIcon from "@material-ui/icons/Dashboard";
import BuildIcon from "@material-ui/icons/Build";

const styles = (theme: any) =>
  createStyles({
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

interface Props extends WithStyles<typeof styles> {
  history: any;
  open: boolean;
  toggleOpen: any;
}

class NavDrawer extends Component<Props> {
  render() {
    const { classes } = this.props;

    return (
      <Drawer
        variant="temporary"
        anchor="left"
        open={this.props.open}
        onClose={this.props.toggleOpen}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <ListItem
          className={classes.listItem}
          button
          onClick={() => this.props.history.push("/item_config")}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Items Config" />
        </ListItem>
        <ListItem
          className={classes.listItem}
          button
          onClick={() => this.props.history.push("/set_config")}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Sets Config" />
        </ListItem>
        <ListItem
          className={classes.listItem}
          button
          onClick={() => this.props.history.push("/general_config")}
        >
          <ListItemIcon>
            <BuildIcon />
          </ListItemIcon>
          <ListItemText primary="General Config" />
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

export default withStyles(styles)(NavDrawer);
