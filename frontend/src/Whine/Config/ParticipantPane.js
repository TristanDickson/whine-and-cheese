import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import LinkIcon from "@material-ui/icons/Link";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import ScoresTable from "./ScoresTable";

const styles = theme => ({
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

class ParticipantPane extends Component {
  copyLink = code => {
    const el = document.createElement("textarea");
    el.value = `${new URL(window.location.href).origin}/rate?${code}`;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    const selected =
      document.getSelection().rangeCount > 0
        ? document.getSelection().getRangeAt(0)
        : false;
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }
  };

  render() {
    const { classes } = this.props;
    let item = this.props.item;
    let fields = this.props.config.fields;

    return (
      <div
        className={classes.appFrame}
        onKeyPress={event => {
          if (event.key === "Enter") {
            document.activeElement.blur();
          }
        }}
      >
        {item && fields ? (
          <div className={classes.contentPaper}>
            <Grid>
              {fields.map(field => (
                <TextField
                  id={field.elementId}
                  key={fields.indexOf(field)}
                  label={field.displayName}
                  className={classes.textField}
                  margin="normal"
                  value={item[field.fieldName] || ""}
                  onChange={event =>
                    this.props.changeItem(
                      item._id,
                      field.fieldName,
                      event.target.value
                    )
                  }
                  onBlur={event =>
                    this.props.updateItem(
                      item._id,
                      field.fieldName,
                      event.target.value
                    )
                  }
                />
              ))}
              <TextField
                disabled
                id="code"
                label="Code"
                className={classes.textField}
                margin="normal"
                value={item.code || ""}
              />
              <Tooltip title="Copy Link">
                <Fab
                  size="small"
                  color="primary"
                  aria-label="Link"
                  className={classes.button}
                  onClick={() => this.copyLink(item.code)}
                >
                  <LinkIcon />
                </Fab>
              </Tooltip>
              <ScoresTable participant_id={this.props.item._id} />
            </Grid>
          </div>
        ) : null}
      </div>
    );
  }
}

ParticipantPane.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ParticipantPane);
