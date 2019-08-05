import React, { Component } from "react";
import { withStyles, createStyles, WithStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import LinkIcon from "@material-ui/icons/Link";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";

const styles = (theme: any) =>
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
    button: {
      margin: theme.spacing.unit
    }
  });

interface Props extends WithStyles<typeof styles> {
  config: any;
  participant: any;
  changeParticipant: any;
  updateParticipant: any;
}

class ParticipantPane extends Component<Props> {
  copyLink = (code: string) => {
    const doc: any = document;

    const el = doc.createElement("textarea");
    el.value = `${new URL(window.location.href).origin}/rate?${code}`;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    doc.body.appendChild(el);
    const selected =
      doc.getSelection().rangeCount > 0
        ? doc.getSelection().getRangeAt(0)
        : false;
    el.select();
    doc.execCommand("copy");
    doc.body.removeChild(el);
    if (selected) {
      doc.getSelection().removeAllRanges();
      doc.getSelection().addRange(selected);
    }
  };

  render() {
    const { classes } = this.props;

    let participant = this.props.participant;
    let fields = this.props.config.fields;

    return (
      <div
        className={classes.appFrame}
        onKeyPress={event => {
          const doc: any = document;
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
                  value={participant[field.fieldName] || ""}
                  onChange={event =>
                    this.props.changeParticipant(
                      participant._id,
                      field.fieldName,
                      event.target.value
                    )
                  }
                  onBlur={event =>
                    this.props.updateParticipant(
                      participant._id,
                      field.fieldName,
                      event.target.value
                    )
                  }
                />
              );
            })}
            <TextField
              disabled
              id="code"
              label="Code"
              className={classes.textField}
              margin="normal"
              value={participant.code || ""}
            />
            <Tooltip title="Copy Link">
              <Fab
                size="small"
                color="primary"
                aria-label="Link"
                className={classes.button}
                onClick={() => this.copyLink(participant.code)}
              >
                <LinkIcon />
              </Fab>
            </Tooltip>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ParticipantPane);
