import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
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
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  appFrame: {
    height: 500,
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    width: "100%"
  },
  drawerPaper: {
    position: "relative",
    width: 320
  },
  contentPaper: {
    marginLeft: 20
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
    marginTop: 5,
    width: 200
  }
});

class ParticipantDrawer extends React.Component {
  constructor() {
    super();
    this.state = { selected: null, participants: [] };
  }

  componentDidMount() {
    this.getParticipants();
  }

  handleListItemClick = selected => {
    this.setState({ ...this.state, selected: selected });
  };

  handleChange = (_id, key, value) => {
    let newState = { ...this.state };
    let newParticipant = newState.participants.find(
      participant => participant._id === _id
    );
    newParticipant[key] = value;
    this.setState(newState);
  };

  getParticipants = () => {
    console.log("Getting Participants");
    fetch("http://localhost:5000/participants")
      .then(response => {
        return response.json();
      })
      .then(participants => {
        console.log(participants);
        this.setState({ ...this.state, participants: participants });
      });
  };

  addParticipant = () => {
    fetch("http://localhost:5000/participants", {
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
      .then(this.getParticipants);
  };

  updateParticipant = (_id, key, value) => {
    fetch("http://localhost:5000/participants", {
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

  deleteParticipant = _id => {
    fetch("http://localhost:5000/participants", {
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
        if (this.state.selected._id === _id) {
          this.setState({ ...this.state, selected: null });
        }
      })
      .then(this.getParticipants);
  };

  copyLink = code => {
    const el = document.createElement("textarea");
    el.value = `http://localhost:3000/rate?${code}`;
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

  buildParticipantList = (list_item_style, button_style) => {
    const participantList = [];
    this.state.participants.forEach(participant => {
      participantList.push(
        <div key={this.state.participants.indexOf(participant)}>
          <ListItem
            className={list_item_style}
            button
            selected={this.state.selected === participant}
            onClick={() => this.handleListItemClick(participant)}
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
            onClick={() => this.deleteParticipant(participant._id)}
          >
            <DeleteIcon/>
          </Fab>
        </div>
      );
    });

    return participantList;
  };

  render() {
    const { classes } = this.props;
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
          variant="permanent"
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <List component="nav">
            {this.buildParticipantList(classes.list_item, classes.button)}
          </List>
          <Divider />
          <List component="nav">
            <ListItem button onClick={event => this.addParticipant()}>
              <ListItemIcon>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary="Add Participant" />
            </ListItem>
          </List>
        </Drawer>
        <div className={classes.contentPaper}>
          {this.state.selected && (
            <div>
              <TextField
                id="first-name"
                label="First Name"
                className={classes.textField}
                margin="normal"
                value={this.state.selected.firstName}
                onChange={event =>
                  this.handleChange(
                    this.state.selected._id,
                    "firstName",
                    event.target.value
                  )
                }
                onBlur={event =>
                  this.updateParticipant(
                    this.state.selected._id,
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
                value={this.state.selected.lastName}
                onChange={event =>
                  this.handleChange(
                    this.state.selected._id,
                    "lastName",
                    event.target.value
                  )
                }
                onBlur={event =>
                  this.updateParticipant(
                    this.state.selected._id,
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
                value={this.state.selected.age}
                onChange={event =>
                  this.handleChange(
                    this.state.selected._id,
                    "age",
                    event.target.value
                  )
                }
                onBlur={event =>
                  this.updateParticipant(
                    this.state.selected._id,
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
                value={this.state.selected.code}
              />
              <Tooltip title="Copy Link">
                <Fab
                  size="small"
                  color="primary"
                  aria-label="Link"
                  className={classes.button}
                  onClick={() => this.copyLink(this.state.selected.code)}
                >
                  <LinkIcon />
                </Fab>
              </Tooltip>
              {<ScoresTable participant_id={this.state.selected._id} />}
            </div>
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
