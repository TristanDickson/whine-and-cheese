import React, { Component } from "react";
import { Grid, TextField } from "@material-ui/core";
import {
  withStyles,
  createStyles,
  Theme,
  WithStyles
} from "@material-ui/core/styles";

const styles = (theme: Theme) =>
  createStyles({
    appFrame: {
      minHeight: 500,
      width: "100%",
      [theme.breakpoints.up(1200 + theme.spacing.unit * 3 * 2)]: {
        width: 1200,
        marginLeft: "auto",
        marginRight: "auto"
      }
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      marginTop: 5,
      [theme.breakpoints.down("xs")]: {
        width: 125
      }
    },
    fab: {
      margin: theme.spacing.unit
    },
    errorMessage: {
      margin: "10px",
      color: "red"
    }
  });

interface Props extends WithStyles<typeof styles> {
  config: any;
  set: any;
  changeSet: any;
  updateSet: any;
}

interface State {}

class SetPane extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selected_participant_id: "",
      selected_set_id: "",
      validInput: true
    };
  }

  changeSet(event: any) {
    if (event) {
      this.setState({
        selected_set_id: event.value
      });
    } else {
      this.setState({
        selected_set_id: ""
      });
    }
  }

  render() {
    const { classes } = this.props;

    let set = this.props.set;
    let fields = this.props.config.fields;
    let doc: any = document;

    return (
      <div
        className={classes.appFrame}
        onKeyPress={event => {
          if (event.key === "Enter") {
            doc.activeElement.blur();
          }
        }}
      >
        <div>
          <Grid>
            {fields.map((field: any) => {
              return (
                <TextField
                  id={field.elementId}
                  key={fields.indexOf(field)}
                  label={field.displayName}
                  className={classes.textField}
                  margin="normal"
                  value={set[field.fieldName] || ""}
                  onChange={event =>
                    this.props.changeSet(
                      set._id,
                      field.fieldName,
                      event.target.value
                    )
                  }
                  onBlur={event =>
                    this.props.updateSet(
                      set._id,
                      field.fieldName,
                      event.target.value
                    )
                  }
                />
              );
            })}
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(SetPane);
