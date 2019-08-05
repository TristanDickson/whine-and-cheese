import React, { Component } from "react";
import { withStyles, WithStyles, createStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem
} from "@material-ui/core";
import {
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon
} from "@material-ui/icons";
import NavDrawer from "./NavDrawer";

const styles = createStyles({
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
});

interface Props extends WithStyles<typeof styles> {
  history: any;
  toggleOpen: any;
  open: boolean;
}

interface State {
  anchorEl: any;
}

class ConfigAppBar extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      anchorEl: null
    };
  }

  handleMenu = (event: any) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  logout = (event: any) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res: any) => {
        this.setState({ anchorEl: null });
        if (res.status === 200) {
          this.props.history.push("/login");
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch(err => {
        console.log(err);
        alert("Error logging out please try again");
      });
  };

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const profileMenuOpen = Boolean(anchorEl);

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={this.props.toggleOpen}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Whine & Cheese
            </Typography>
            <div>
              <IconButton
                aria-owns={profileMenuOpen ? "menu-appbar" : undefined}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
              >
                <AccountCircleIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                open={profileMenuOpen}
                onClose={this.handleClose}
              >
                <MenuItem onClick={this.logout}>Logout</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
        <NavDrawer
          history={this.props.history}
          open={this.props.open}
          toggleOpen={this.props.toggleOpen}
        />
      </div>
    );
  }
}

export default withStyles(styles)(ConfigAppBar);
