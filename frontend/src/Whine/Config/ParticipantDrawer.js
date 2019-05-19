import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip";
import PersonIcon from "@material-ui/icons/Person";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import DeleteIcon from "@material-ui/icons/Delete";
import LinkIcon from "@material-ui/icons/Link";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import ScoresTable from "./ScoresTable";

const styles = theme => ({
  appFrame: {
    height: 500,
    zIndex: 1,
    //overflow: "hidden",
    //position: "relative",
    //display: "flex",
    width: "100%"
  },
  drawerPaper: {
    //position: "relative",
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
  contentPaper: {
    //marginLeft: 20
  },
  list_item: {
    width: 240,
    display: "inline-flex"
  },
  button: {
    margin: theme.spacing.unit
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: 5
  }
});

class ParticipantDrawer extends Component {
  constructor(props) {
    super();
    this.state = { selectedId: null, participants: [] };
  }

  async componentDidMount() {
    await this.getItems();
    if (this.state.participants[0]) {
      this.setState({
        ...this.state,
        selectedId: this.state.participants[0]._id
      });
    }
  }

  handleListItemClick = selectedId => {
    this.setState({ ...this.state, selectedId: selectedId });
  };

  handleChange = (_id, key, value) => {
    let newState = { ...this.state };
    let newParticipant = newState.participants.find(
      participant => participant._id === _id
    );
    newParticipant[key] = value;
    this.setState(newState);
  };

  getItems = async () => {
    console.log("Getting Participants");
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/participants`)
      .then(response => {
        return response.json();
      })
      .then(participants => {
        this.setState({ ...this.state, participants: participants });
      });
  };

  addItem = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/participants`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "",
        lastName: "",
        age: ""
      })
    })
      .then(res => {
        if (res.ok) return res.json();
      })
      .then(this.getItems);
  };

  updateItem = (_id, key, value) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/participants`, {
      method: "put",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        _id: _id,
        key: key,
        value: value
      })
    }).then(res => {
      if (res.ok) return res.json();
    });
  };

  deleteItem = _id => {
    console.log(`Deleting participant with id: ${_id}`);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/participants`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        _id: _id
      })
    })
      .then(res => {
        if (res.ok) return res.json();
      })
      .then(() => {
        if (this.state.selectedId === _id) {
          this.setState({ ...this.state, selectedId: null });
        }
      })
      .then(this.getItems);
  };

  copyLink = code => {
    const el = document.createElement("textarea");
    el.value = `${new URL(window.location.href).origin}/rate?${code}`;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    const selected =
      document.getSelection().rangeCount > 0
        ? document.getSelection().getRangeAt(0)
        : false;
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }
  };

  createItemList = (list_item_style, button_style) => {
    const participantList = [];
    this.state.participants.forEach(participant => {
      participantList.push(
        <div key={this.state.participants.indexOf(participant)}>
          <ListItem
            className={list_item_style}
            button
            selected={this.state.selectedId === participant._id}
            onClick={() => this.handleListItemClick(participant._id)}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                participant.firstName === ""
                  ? `Participant ${this.state.participants.indexOf(
                      participant
                    ) + 1}`
                  : participant.firstName + " " + participant.lastName
              }
            />
          </ListItem>
          <Fab
            size="small"
            color="secondary"
            aria-label="Add"
            className={button_style}
            onClick={() => this.deleteItem(participant._id)}
          >
            <DeleteIcon />
          </Fab>
        </div>
      );
    });

    return participantList;
  };

  createItemInputs = (field_style, selectedItem) => {
    const itemInputs = [];
    this.props.config.fields.forEach(field => {
      itemInputs.push(
        <TextField
          id={field.elementId}
          key={this.props.config.fields.indexOf(field)}
          label={field.displayName}
          className={field_style}
          margin="normal"
          value={selectedItem[field.fieldName]}
          onChange={event =>
            this.updateItem(
              selectedItem._id,
              field.fieldName,
              event.target.value
            )
          }
        />
      );
    });

    return itemInputs;
  };

  render() {
    const { classes } = this.props;
    let selectedParticipant = this.state.participants.find(
      participant => participant._id === this.state.selectedId
    );

    return (
      <div
        className={classes.appFrame}
        onKeyPress={event => {
          if (event.key === "Enter") {
            document.activeElement.blur();
          }
        }}
      >
        <Drawer
          variant="temporary"
          anchor="left"
          open={this.props.open}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <List component="nav">
            {this.createItemList(classes.list_item, classes.button)}
          </List>
          <Divider />
          <List component="nav">
            <ListItem button onClick={event => this.addItem()}>
              <ListItemIcon>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary="Add Participant" />
            </ListItem>
          </List>
        </Drawer>
        <div className={classes.contentPaper}>
          {this.state.selectedId && (
            <Grid>
              <TextField
                id="first-name"
                label="First Name"
                className={classes.textField}
                margin="normal"
                value={selectedParticipant.firstName}
                onChange={event =>
                  this.handleChange(
                    selectedParticipant._id,
                    "firstName",
                    event.target.value
                  )
                }
                onBlur={event =>
                  this.updateItem(
                    selectedParticipant._id,
                    "firstName",
                    event.target.value
                  )
                }
              />
              <TextField
                id="last-name"
                label="Last Name"
                className={classes.textField}
                margin="normal"
                value={selectedParticipant.lastName}
                onChange={event =>
                  this.handleChange(
                    selectedParticipant._id,
                    "lastName",
                    event.target.value
                  )
                }
                onBlur={event =>
                  this.updateItem(
                    selectedParticipant._id,
                    "lastName",
                    event.target.value
                  )
                }
              />
              <TextField
                id="age"
                label="Age"
                className={classes.textField}
                margin="normal"
                value={selectedParticipant.age}
                onChange={event =>
                  this.handleChange(
                    selectedParticipant._id,
                    "age",
                    event.target.value
                  )
                }
                onBlur={event =>
                  this.updateItem(
                    selectedParticipant._id,
                    "age",
                    event.target.value
                  )
                }
              />
              <TextField
                disabled
                id="code"
                label="Code"
                className={classes.textField}
                margin="normal"
                value={selectedParticipant.code}
              />
              <Tooltip title="Copy Link">
                <Fab
                  size="small"
                  color="primary"
                  aria-label="Link"
                  className={classes.button}
                  onClick={() => this.copyLink(selectedParticipant.code)}
                >
                  <LinkIcon />
                </Fab>
              </Tooltip>
              {<ScoresTable participant_id={selectedParticipant._id} />}
            </Grid>
          )}
        </div>
      </div>
    );
  }
}

ParticipantDrawer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ParticipantDrawer);
