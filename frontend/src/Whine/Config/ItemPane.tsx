import React, { Component } from "react";
import { Grid, TextField } from "@material-ui/core";
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme
} from "@material-ui/core/styles";

const styles = (theme: Theme) =>
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
    list_item: {
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
  item: any;
  config: any;
  changeItem: any;
  updateItem: any;
}

class ItemDrawer extends Component<Props> {
  render() {
    const { classes } = this.props;
    let item = this.props.item;
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
        {item && fields ? (
          <div>
            <Grid>
              {fields.map((field: any) => (
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
            </Grid>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withStyles(styles)(ItemDrawer);
