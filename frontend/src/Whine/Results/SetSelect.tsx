import { withStyles, createStyles, WithStyles } from "@material-ui/core/styles";
import React from "react";
import {
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  FilledInput
} from "@material-ui/core";

import ItemConfigs from "../Config/ItemConfigs.json";

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

type Props = WithStyles<typeof styles> & {
  sets: any;
  selectedSet: any;
  changeSet: any;
};

const SetSelect = (props: Props) => {
  const sets = props.sets;
  const { classes, selectedSet, changeSet } = props;

  return (
    <div className={classes.root}>
      <FormControl variant="filled" className={classes.formControl}>
        <InputLabel htmlFor="set-select">Item</InputLabel>
        <Select
          value={selectedSet}
          onChange={event => changeSet(event)}
          input={<FilledInput name="item" id="item-select" />}
        >
          {sets.map((set: any) => (
            <MenuItem key={set._id} value={sets.indexOf(set)}>
              {ItemConfigs[3].fields.map(field => {
                return field.keyName ? `${set[field.fieldName]} ` : ``;
              })}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default withStyles(styles)(SetSelect);
