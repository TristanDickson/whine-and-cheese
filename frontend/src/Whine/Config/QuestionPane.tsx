import React, { Component } from "react";
import { withStyles, createStyles, WithStyles } from "@material-ui/core/styles";
import { Grid, TextField } from "@material-ui/core";

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
    list_question: {
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
  question: any;
  config: any;
  changeQuestion: any;
  updateQuestion: any;
}

class QuestionPane extends Component<Props> {
  render() {
    const { classes } = this.props;
    let question = this.props.question;
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
        {question && fields ? (
          <div>
            <Grid>
              {fields.map((field: any) => (
                <TextField
                  id={field.elementId}
                  key={fields.indexOf(field)}
                  label={field.displayName}
                  className={classes.textField}
                  margin="normal"
                  value={question[field.fieldName] || ""}
                  onChange={event =>
                    this.props.changeQuestion(
                      question._id,
                      field.fieldName,
                      event.target.value
                    )
                  }
                  onBlur={event =>
                    this.props.updateQuestion(
                      question._id,
                      field.fieldName,
                      event.target.value
                    )
                  }
                />
              ))}
            </Grid>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withStyles(styles)(QuestionPane);
