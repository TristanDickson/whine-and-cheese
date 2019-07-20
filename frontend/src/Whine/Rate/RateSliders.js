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
    //flexGrow: 1,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  textField: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    marginTop: 5
  }
});

function Sliders(props) {
  const { classes } = props;

  return (
    <Grid container spacing={8} className={classes.root}>
			<Grid item xs={12}>
				{console.log(props.wine)}
        <Typography variant="h5" align="center">
          {props.wine
            ? props.wine.wine.name
            : props.start
            ? `Welcome ${props.participantName}.
              Please partake of the wines.`
            : `As you descend into madness, remember that your inebriation was self-inflicted.`}
        </Typography>
      </Grid>
      {props.wine ? (
        <Grid className={classes.root}>
          <Grid item xs={12}>
            {props.wine.scores.map(score => (
              <RateSlider
                key={score._id}
                score={score}
                updateScore={props.updateScore}
              />
            ))}
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField
              id="comment"
              label="Comment"
              multiline
              rowsMax="4"
              fullWidth
              className={classes.textField}
              margin="normal"
              value={props.wine.comment.comment}
              onChange={event => {
                props.updateComment(event.target.value);
              }}
            />
          </Grid>
        </Grid>
      ) : null}
    </Grid>
  );
}

Sliders.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Sliders);
