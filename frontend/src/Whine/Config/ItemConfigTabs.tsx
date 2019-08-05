import React, { Fragment, Component } from "react";
import {
  AppBar,
  Fab,
  FilledInput,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography,
  withStyles,
  createStyles,
  Theme,
  WithStyles
} from "@material-ui/core";
import {
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon
} from "@material-ui/icons";

import { connect } from "react-redux";
import {
  addParticipant,
  updateParticipant,
  deleteParticipant
} from "../../State/actions";

import ItemConfigs from "./ItemConfigs.json";
import { ItemConfigIcons } from "./ItemConfigIcons";
import ParticipantPane from "./ParticipantPane";
import SetPane from "./SetPane";
import QuestionPane from "./QuestionPane";
import SubjectPane from "./SubjectPane";

const styles = (theme: Theme) =>
  createStyles({
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

interface Props extends WithStyles<typeof styles> {}

interface State {
  items: [];
  selectedId: string;
  value: number;
}

class ConfigTabs extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      items: [],
      selectedId: "",
      value: 0
    };
  }

  async componentDidMount() {
    await this.getItems();
  }

  getItems = async (selectedId: string = "") => {
    console.log(`Getting ${ItemConfigs[this.state.value].displayName}s...`);
    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/${
        ItemConfigs[this.state.value].resourceName
      }`
    );
    let items = await response.json();
    console.log(
      `${ItemConfigs[this.state.value].displayName}s: ${JSON.stringify(items)}`
    );

    if (selectedId !== "") {
      this.setState({
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
    let json: any = {};
    ItemConfigs[this.state.value].fields.forEach(field => {
      json[field.fieldName] = "";
    });
    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/${
        ItemConfigs[this.state.value].resourceName
      }`,
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json)
      }
    );
    let parsedResponse = await response.json();
    this.getItems(parsedResponse.insertedId);
  };

  updateItem = async (_id: string, key: string, value: string) => {
    console.log(`Updating item with id: ${_id}, key: ${key}, value: ${value}`);
    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/${
        ItemConfigs[this.state.value].resourceName
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

  deleteItem = async (_id: string) => {
    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/${
        ItemConfigs[this.state.value].resourceName
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

  handleChangeTab = async (event: any, value: number) => {
    await this.setState({ ...this.state, value: value });
    this.getItems();
  };

  handleChangeItem = (event: any) => {
    this.setState({ ...this.state, selectedId: event.target.value });
  };

  handleChangeField = (_id: string, key: string, value: string) => {
    let newState = { ...this.state };
    let newItem: any = newState.items.find((item: any) => item._id === _id);
    newItem[key] = value;
    this.setState(newState);

    console.log(`key: ${key}, value: ${value}`);
    console.log(this.state);
  };

  render() {
    const { classes } = this.props;
    let value = this.state.value;
    let items = this.state.items;
    let selectedId = this.state.selectedId;
    let selectedItem;
    if (items && selectedId) {
      selectedItem = items.find((item: any) => item._id === selectedId);
    }
    let config = ItemConfigs[value];

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
            {ItemConfigs.map((itemConfig: any) => (
              <Tab
                label={`${itemConfig.displayName}s`}
                icon={ItemConfigIcons[itemConfig.iconName]}
              />
            ))}
          </Tabs>
        </AppBar>
        <FormControl variant="filled" className={classes.formControl}>
          <InputLabel htmlFor="item-select">Item</InputLabel>
          <Select
            value={selectedId}
            onChange={this.handleChangeItem}
            input={<FilledInput name="item" id="item-select" />}
          >
            {items.map((item: any) => (
              <MenuItem key={item._id} value={item._id}>
                {config.fields.map(field => {
                  return field.keyName ? `${item[field.fieldName]} ` : ``;
                })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectedItem && (
          <Typography component="div" style={{ padding: 8 * 3 }}>
            {value === 0 && (
              <ParticipantPane
                config={ItemConfigs[value]}
                participant={selectedItem}
                updateParticipant={this.updateItem}
                changeParticipant={this.handleChangeField}
              />
            )}
            {value === 1 && (
              <Fragment>
                <SubjectPane
                  config={ItemConfigs[value]}
                  subject={selectedItem}
                  updateSubject={this.updateItem}
                  changeSubject={this.handleChangeField}
                />
              </Fragment>
            )}
            {value === 2 && (
              <QuestionPane
                config={ItemConfigs[value]}
                question={selectedItem}
                updateQuestion={this.updateItem}
                changeQuestion={this.handleChangeField}
              />
            )}
            {value === 3 && (
              <SetPane
                config={ItemConfigs[value]}
                set={selectedItem}
                updateSet={this.updateItem}
                changeSet={this.handleChangeField}
              />
            )}
          </Typography>
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

const mapStateToProps = (state: any) => ({ ...state });

const mapDispatchToProps = {
  addParticipant,
  updateParticipant,
  deleteParticipant
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ConfigTabs));
