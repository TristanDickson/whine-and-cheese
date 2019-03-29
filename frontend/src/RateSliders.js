import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import RateSlider from "./RateSlider";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
  root: {
    width: "100%",
    flexGrow: 1,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  }
});

function Sliders(props) {
  const { classes } = props;

  return (
    <Grid container spacing={8} className={classes.root}>
      <Grid item xs={12}>
        <Typography variant="h5" align="center">
          {props.wine ? props.wine.name : "Finished!"}
        </Typography>
      </Grid>
      {props.wine ? (
        <Grid item xs={12}>
          {props.wine.metrics.map(metric => (
            <RateSlider key={metric.name} metric={metric} updateScore={props.updateScore} />
          ))}
        </Grid>
      ) : null}
    </Grid>
  );
}

Sliders.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Sliders);
