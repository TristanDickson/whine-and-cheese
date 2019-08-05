import React, { Component } from "react";
import { Grid, Typography, withStyles, createStyles } from "@material-ui/core";
import Slider from "@material-ui/lab/Slider";

const styles = (theme: any) =>
  createStyles({
    root: {
      width: "100%",
      flexGrow: 1
    },
    sliderContainer: {
      padding: "22px 0px"
    },
    sliderTrack: {},
    sliderThumb: {}
  });

interface Props {
  classes: any;
  answer: any;
  updateAnswer: any;
}

interface State {
  value: number;
}

class RateSlider extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { value: props.answer.value || 0 };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.answer !== this.props.answer) {
      this.setState({ value: this.props.answer.value });
    }
  }

  handleChange = (updateAnswer: any, answer: any) => (
    event: any,
    value: number
  ) => {
    updateAnswer(answer, value);
    this.setState({ value: value });
  };

  render() {
    const { classes, answer } = this.props;
    const { value } = this.state;

    return (
      <Grid container spacing={8} alignItems="center" className={classes.root}>
        <Grid item xs={3} md={3}>
          <Typography align="center" variant="body2" gutterBottom>
            {answer.question.name}
          </Typography>
        </Grid>
        <Grid item xs={7} md={6}>
          <div>
            <Slider
              classes={{
                container: classes.sliderContainer,
                track: classes.sliderTrack,
                thumb: classes.sliderThumb
              }}
              value={value}
              min={1}
              max={5}
              step={1}
              onChange={this.handleChange(this.props.updateAnswer, answer)}
            />
          </div>
        </Grid>
        <Grid item xs={2} md={3}>
          <Typography align="center" variant="body2" gutterBottom>
            {value}
          </Typography>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(RateSlider);
