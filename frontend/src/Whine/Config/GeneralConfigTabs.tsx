import { withStyles, createStyles, WithStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import ItemConfigs from "./ItemConfigs.json";

import { connect } from "react-redux";
import {
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  FilledInput,
  TextField,
  Grid
} from "@material-ui/core";

const styles = (theme: any) =>
  createStyles({
    root: {
      width: "100%",
      backgroundColor: theme.palette.background.paper
    },
    formControl: {
      width: "100%"
    },
    textFieldContainer: {
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2
    },
    textField: {
      marginTop: theme.spacing.unit
    }
  });

interface Props extends WithStyles<typeof styles> {
  sets: any;
}

interface State {
  value: number;
  sets: any;
  selectedId: string;
}

class ConfigTabs extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      value: 0,
      sets: [],
      selectedId: ""
    };
  }

  handleChangeTab = async (event: any, value: number) => {
    await this.setState({ value: value });
  };

  handleChangeItem = (event: any) => {
    this.setState({ selectedId: event.target.value });
  };

  render() {
    const { classes } = this.props;
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
        <Grid container className={classes.textFieldContainer}>
          <Grid item xs={1} md={2} />
          <Grid item xs={10} md={8}>
            <TextField
              id="welcome-message"
              label="Welcome Message"
              className={classes.textField}
              fullWidth
              margin="normal"
            />
            <TextField
              id="farewell-message"
              label="Farewell Message"
              className={classes.textField}
              fullWidth
              margin="normal"
            />
          </Grid>
        </Grid>
        <Grid item xs={1} md={2} />
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({ ...state });

export default connect(mapStateToProps)(withStyles(styles)(ConfigTabs));
