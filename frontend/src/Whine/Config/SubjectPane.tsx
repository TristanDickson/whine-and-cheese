import React, { Component } from "react";
import { withStyles, createStyles, WithStyles } from "@material-ui/core/styles";
import { Grid, TextField, Select, MenuItem } from "@material-ui/core";

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
    drawerPaper: {
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
    list_subject: {
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
          <div>
            <Grid>
              {fields.map((field: any) => {
                switch (field.type) {
                  case "text":
                    return (
                      <TextField
                        id={field.elementId}
                        key={fields.indexOf(field)}
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
                      <Select
                        value={field.options[0]}
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
                        {/*field.options.map((option: string) => {
                          <MenuItem value={option}>{option}</MenuItem>;
                        })*/}
                      </Select>
                    );
                  default:
                    return null;
                }
              })}
            </Grid>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withStyles(styles)(SubjectPane);
