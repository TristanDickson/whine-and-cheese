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
  score: any;
  updateScore: any;
}

interface State {
  value: number;
}

class RateSlider extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { value: props.score.value };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.score !== this.props.score) {
      this.setState({ value: this.props.score.value });
    }
  }

  handleChange = (updateScore: any, score: any) => (
    event: any,
    value: number
  ) => {
    updateScore(score, value);
    this.setState({ value: value });
  };

  render() {
    const { classes } = this.props;
    const score = this.props.score;
    const { value } = this.state;

    return (
      <Grid container spacing={8} alignItems="center" className={classes.root}>
        <Grid item xs={3} md={3}>
          <Typography align="center" variant="body2" gutterBottom>
            {score.metric.name}
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
              onChange={this.handleChange(this.props.updateScore, score)}
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
