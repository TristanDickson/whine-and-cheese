import { withStyles, createStyles, WithStyles } from "@material-ui/core/styles";
import React, { Component } from "react";

import { connect } from "react-redux";
import {
  AppBar,
  Tab,
  Tabs,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  FilledInput,
  Typography
} from "@material-ui/core";

import ItemConfigs from "./ItemConfigs.json";
import ParticipantSelect from "./ParticipantSelect";
import SubjectSelect from "./SubjectSelect";
import QuestionSelect from "./QuestionSelect";
import { ItemConfigIcons } from "./ItemConfigIcons";

const styles = (theme: any) =>
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

interface StateProps {
  sets: any;
}

type Props = WithStyles<typeof styles> &
  StateProps & {
    set_id: string;
  };

interface State {
  value: number;
  selectedId: string;
}

class ConfigTabs extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      value: 0,
      selectedId: ""
    };
  }

  componentDidMount = () => {
    let selectedId = this.state.selectedId;
    let sets = this.props.sets.sets;

    if (sets.length > 0 && selectedId === "") {
      this.setState({ selectedId: sets[0]._id });
    }
  };

  componentDidUpdate = () => {
    let selectedId = this.state.selectedId;
    let sets = this.props.sets.sets;

    if (sets.length > 0 && selectedId === "") {
      this.setState({ selectedId: sets[0]._id });
    }
  };

  handleChangeTab = async (event: any, value: number) => {
    await this.setState({ value: value });
  };

  handleChangeItem = (event: any) => {
    this.setState({ selectedId: event.target.value });
  };

  render() {
    const { classes } = this.props;
    let value = this.state.value;
    let selectedId = this.state.selectedId;
    let sets = this.props.sets.sets;

    return (
      <div className={classes.root}>
        <FormControl variant="filled" className={classes.formControl}>
          <InputLabel htmlFor="set-select">Item</InputLabel>
          <Select
            value={selectedId}
            onChange={this.handleChangeItem}
            input={<FilledInput name="item" id="item-select" />}
          >
            {sets.map((set: any) => (
              <MenuItem key={set._id} value={set._id}>
                {ItemConfigs[3].fields.map(field => {
                  return field.keyName ? `${set[field.fieldName]} ` : ``;
                })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChangeTab}
            indicatorColor={"secondary"}
            textColor="secondary"
            variant="fullWidth"
          >
            {ItemConfigs.filter(
              (itemConfig: any) => ItemConfigs.indexOf(itemConfig) < 3
            ).map((itemConfig: any) => (
              <Tab
                key={itemConfig.displayName}
                label={`${itemConfig.displayName}s`}
                icon={ItemConfigIcons[itemConfig.iconName]}
              />
            ))}
          </Tabs>
        </AppBar>
        <Typography component="div" style={{ padding: 8 * 3 }}>
          {value === 0 && <ParticipantSelect set_id={selectedId} />}
          {value === 1 && <SubjectSelect set_id={selectedId} />}
          {value === 2 && <QuestionSelect set_id={selectedId} />}
        </Typography>
      </div>
    );
  }
}

const mapStateToProps = (state: any): StateProps => {
  const { sets } = state;
  return { sets };
};

export default connect(mapStateToProps)(withStyles(styles)(ConfigTabs));
