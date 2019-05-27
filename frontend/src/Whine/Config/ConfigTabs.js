import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import People from "@material-ui/icons/People";
import LocalBar from "@material-ui/icons/LocalBar";
import BarChart from "@material-ui/icons/BarChart";
import ParticipantPane from "./ParticipantDrawer";
import ItemDrawer from "./ItemDrawer";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FilledInput from "@material-ui/core/FilledInput";
import Fab from "@material-ui/core/Fab";

//import PersonIcon from "@material-ui/icons/Person";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import DeleteIcon from "@material-ui/icons/Delete";

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

const styles = theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  formControl: {
    width: "100%"
  },
  fabBox: {
    position: "fixed",
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2
  },
  button: {
    margin: theme.spacing.unit
  }
});

const drawerProps = [
  {
    resourceName: "api/participants",
    displayName: "Participant",
    fields: [
      {
        keyName: true,
        fieldName: "firstName",
        elementId: "first-name",
        displayName: "First Name"
      },
      {
        keyName: true,
        fieldName: "lastName",
        elementId: "last-name",
        displayName: "Last Name"
      },
      {
        fieldName: "age",
        elementId: "age",
        displayName: "Age"
      }
    ]
  },
  {
    resourceName: "api/wines",
    displayName: "Wine",
    fields: [
      {
        keyName: true,
        fieldName: "name",
        elementId: "name",
        displayName: "Name"
      },
      {
        fieldName: "label",
        elementId: "label",
        displayName: "Label"
      },
      {
        fieldName: "colour",
        elementId: "colour",
        displayName: "Colour"
      }
    ]
  },
  {
    resourceName: "api/metrics",
    displayName: "Metric",
    fields: [
      {
        keyName: true,
        fieldName: "name",
        elementId: "name",
        displayName: "Name"
      },
      {
        fieldName: "description",
        elementId: "description",
        displayName: "Description"
      }
    ]
  }
];

class ConfigTabs extends React.Component {
  constructor(props) {
    super();
    this.state = {
      value: 0
    };
  }

  async componentDidMount() {
    await this.getItems();
  }

  getItems = async (selectedId = null) => {
    console.log(`Getting ${drawerProps[this.state.value].displayName}s...`);
    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/${
        drawerProps[this.state.value].resourceName
      }`
    );
    let items = await response.json();
    console.log(items);

    if (selectedId) {
      this.setState({
        ...this.state,
        items: items,
        selectedId: selectedId
      });
    } else if (items.length > 0) {
      this.setState({
        ...this.state,
        items: items,
        selectedId: items[0]._id
      });
    } else {
      this.setState({
        ...this.state,
        items: items,
        selectedId: ""
      });
    }
  };

  addItem = async () => {
    let json = {};
    drawerProps[this.state.value].fields.forEach(field => {
      json[field.fieldName] = ""
    });
    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/${
        drawerProps[this.state.value].resourceName
      }`,
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json)
      }
    );
    response = await response.json();
    this.getItems(response.insertedId);
  };

  updateItem = async (_id, key, value) => {
    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/${
        drawerProps[this.state.value].resourceName
      }`,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          _id: _id,
          key: key,
          value: value
        })
      }
    );
    response = await response.json();
    return response;
  };

  deleteItem = async _id => {
    console.log(`Deleting participant with id: ${_id}`);
    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/${
        drawerProps[this.state.value].resourceName
      }`,
      {
        method: "delete",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          _id: _id
        })
      }
    );
    response = await response.json();
    this.getItems();
    return response;
  };

  handleChangeTab = async (event, value) => {
    await this.setState({ ...this.state, value: value });
    this.getItems();
  };

  handleChangeItem = (event, value) => {
    this.setState({ ...this.state, selectedId: value.props.value });
  };

  handleChangeField = (_id, key, value) => {
    let newState = { ...this.state };
    let newItem = newState.items.find(item => item._id === _id);
    newItem[key] = value;
    this.setState(newState);
  };

  render() {
    const { classes } = this.props;
    let value = this.state.value;
    let items = this.state.items;
    let selectedId = this.state.selectedId;
    let selectedItem;
    if (items && selectedId) {
      selectedItem = items.find(item => item._id === selectedId);
    }
    let config = drawerProps[value];

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChangeTab}
            indicatorColor={"secondary"}
            textColor="secondary"
            variant="fullWidth"
          >
            <Tab label="Participants" icon={<People />} />
            <Tab label="Wines" icon={<LocalBar />} />
            <Tab label="Metrics" icon={<BarChart />} />
          </Tabs>
        </AppBar>
        <FormControl variant="filled" className={classes.formControl}>
          <InputLabel htmlFor="item-select">Item</InputLabel>
          {items && selectedId ? (
            <Select
              value={selectedId}
              onChange={this.handleChangeItem}
              input={<FilledInput name="age" id="item-select" />}
            >
              {items.map(item => (
                <MenuItem key={item._id} value={item._id}>
                  {config.fields.map(field => {
                    return field.keyName ? `${item[field.fieldName]} ` : ``;
                  })}
                </MenuItem>
              ))}
            </Select>
          ) : null}
        </FormControl>
        {selectedItem && (
          <TabContainer>
            {value === 0 && (
              <ParticipantPane
                config={drawerProps[value]}
                item={selectedItem}
                updateItem={this.updateItem}
                changeItem={this.handleChangeField}
              />
            )}
            {value === 1 && (
              <ItemDrawer
                config={drawerProps[value]}
                item={selectedItem}
                updateItem={this.updateItem}
                changeItem={this.handleChangeField}
              />
            )}
            {value === 2 && (
              <ItemDrawer
                config={drawerProps[value]}
                item={selectedItem}
                updateItem={this.updateItem}
                changeItem={this.handleChangeField}
              />
            )}
          </TabContainer>
        )}
        <div className={classes.fabBox}>
          <Fab
            className={classes.button}
            color="primary"
            onClick={() => this.addItem()}
          >
            <PersonAddIcon />
          </Fab>
          <Fab
            className={classes.button}
            color="secondary"
            onClick={() => this.deleteItem(this.state.selectedId)}
          >
            <DeleteIcon />
          </Fab>
        </div>
      </div>
    );
  }
}

ConfigTabs.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ConfigTabs);
