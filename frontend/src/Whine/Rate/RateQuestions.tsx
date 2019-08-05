import React from "react";
import {
  Grid,
  Typography,
  withStyles,
  createStyles,
  TextField
} from "@material-ui/core";
import RateSlider from "./RateSlider";

const styles = (theme: any) =>
  createStyles({
    textFieldContainer: {
      marginLeft: theme.spacing.unit * 2,
      marginRight: theme.spacing.unit * 2,
      width: "100%"
    }
  });

interface Props {
  classes: any;
  start: any;
  participantName: any;
  subject: any;
  updateAnswer: any;
}

function RateQuestions(props: Props) {
  const { classes } = props;

  return (
    <Grid container spacing={8} className={classes.root}>
      <Grid item xs={12}>
        <Typography variant="h5" align="center">
          {props.subject
            ? props.subject.subject.name
            : props.start
            ? `Welcome ${props.participantName}.
              Please partake of the subjects.`
            : `As you descend into madness, remember that your inebriation was self-inflicted.`}
        </Typography>
      </Grid>
      {props.subject
        ? props.subject.answers.map((answer: any) => {
            switch (answer.question.type) {
              case "Slider":
                return (
                  <Grid key={answer._id} item xs={12}>
                    <RateSlider
                      answer={answer}
                      updateAnswer={props.updateAnswer}
                    />
                  </Grid>
                );
              case "Textbox":
                return (
                  <Grid
                    key={answer._id}
                    container
                    spacing={8}
                    className={classes.textFieldContainer}
                  >
                    <Grid item xs={false} md={1} />
                    <Grid item xs={12} md={10}>
                      <TextField
                        id={answer._id}
                        label={answer.question.name}
                        multiline
                        rowsMax="4"
                        fullWidth
                        className={classes.textField}
                        margin="normal"
                        value={answer.value}
                        onChange={event =>
                          props.updateAnswer(answer, event.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={false} md={1} />
                  </Grid>
                );
              default:
                return null;
            }
          })
        : null}
    </Grid>
  );
}

export default withStyles(styles)(RateQuestions);
