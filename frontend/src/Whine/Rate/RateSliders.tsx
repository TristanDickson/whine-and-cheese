import React from "react";
import {
  Grid,
  TextField,
  Typography,
  withStyles,
  createStyles
} from "@material-ui/core";
import RateSlider from "./RateSlider";

const styles = (theme: any) =>
  createStyles({
    root: {
      width: "100%",
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit
    },
    textField: {
      paddingLeft: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
      marginTop: 5
    }
  });

interface Props {
  classes: any;
  start: any;
  participantName: any;
  wine: any;
  updateScore: any;
  updateComment: any;
}

function Sliders(props: Props) {
  const { classes } = props;

  return (
    <Grid container spacing={8} className={classes.root}>
      {console.log(props.wine)}
      <Grid item xs={12}>
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
            {props.wine.scores.map((score: any) => (
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

export default withStyles(styles)(Sliders);
