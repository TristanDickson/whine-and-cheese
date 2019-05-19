import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import RateSlider from "./RateSlider";

const styles = theme => ({
  root: {
    width: "100%",
    flexGrow: 1,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: 5
  }
});

function Sliders(props) {
  const { classes } = props;

  return (
    <Grid container spacing={8} className={classes.root}>
      <Grid item xs={12}>
        <Typography variant="h5" align="center">
          {props.wine
            ? props.wine.label
            : props.start
            ? `Welcome ${props.participantName}.
              Please partake of the wines.`
            : `As you descend into madness, remember that your inebriation was self-inflicted.`}
        </Typography>
      </Grid>
      {props.wine ? (
          <Grid item xs={12}>
            {props.wine.metrics.map(metric => (
              <RateSlider
                key={metric.name}
                metric={metric}
                updateScore={props.updateScore}
              />
            ))}
          </Grid>
          /*<TextField
            id="comment"
            label="Comment"
            className={classes.textField}
            margin="normal"
            value="comment"
            onChange={event =>
              this.props.changeComment(
                selectedParticipant._id,
                "firstName",
                event.target.value
              )
            }
            onBlur={event =>
              this.updateComment(
                selectedParticipant._id,
                "firstName",
                event.target.value
              )
            }
          />*/
      ) : null}
    </Grid>
  );
}

Sliders.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Sliders);
