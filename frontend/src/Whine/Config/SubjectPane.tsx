import React, { Component } from "react";
import { withStyles, createStyles, WithStyles } from "@material-ui/core/styles";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@material-ui/core";

const styles = (theme: any) =>
  createStyles({
    appFrame: {
      height: 500,
      zIndex: 1,
      width: "100%",
      [theme.breakpoints.up(1200 + theme.spacing.unit * 3 * 2)]: {
        width: 1200,
        marginLeft: "auto",
        marginRight: "auto"
      }
    },
    form: {
      display: "flex",
      flexWrap: "wrap"
    },
    formControl: {
      margin: theme.spacing.unit,
      minWidth: 120
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      marginTop: theme.spacing.unit,
      [theme.breakpoints.down("xs")]: {
        width: 100
      }
    },
    select: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      marginTop: theme.spacing.unit,
      [theme.breakpoints.down("xs")]: {
        width: 100
      }
    }
  });

interface Props extends WithStyles<typeof styles> {
  subject: any;
  config: any;
  changeSubject: any;
  updateSubject: any;
}

class SubjectPane extends Component<Props> {
  render() {
    const { classes } = this.props;
    let subject = this.props.subject;
    let fields = this.props.config.fields;
    let activeEl: any = document.activeElement;

    return (
      <div
        className={classes.appFrame}
        onKeyPress={event => {
          if (event.key === "Enter") {
            activeEl.blur();
          }
        }}
      >
        {subject && fields ? (
          <form noValidate autoComplete="off">
            {fields.map((field: any) => {
              switch (field.type) {
                case "text":
                  return (
                    <TextField
                      key={fields.indexOf(field)}
                      id={field.elementId}
                      label={field.displayName}
                      className={classes.textField}
                      margin="normal"
                      value={subject[field.fieldName] || ""}
                      onChange={event =>
                        this.props.changeSubject(
                          subject._id,
                          field.fieldName,
                          event.target.value
                        )
                      }
                      onBlur={event =>
                        this.props.updateSubject(
                          subject._id,
                          field.fieldName,
                          event.target.value
                        )
                      }
                    />
                  );
                case "dropdown":
                  return (
                    <FormControl
                      key={fields.indexOf(field)}
                      className={classes.formControl}
                    >
                      <InputLabel htmlFor={field.elementId}>
                        {field.displayName}
                      </InputLabel>
                      <Select
                        id={field.elementId}
                        value={subject[field.fieldName] || field.options[0]}
                        onChange={event => {
                          this.props.changeSubject(
                            subject._id,
                            field.fieldName,
                            event.target.value
                          );
                          this.props.updateSubject(
                            subject._id,
                            field.fieldName,
                            event.target.value
                          );
                        }}
                      >
                        {field.options.map((option: string) => (
                          <MenuItem
                            key={field.options.indexOf(option)}
                            value={option}
                          >
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                default:
                  return null;
              }
            })}
          </form>
        ) : null}
      </div>
    );
  }
}

export default withStyles(styles)(SubjectPane);
