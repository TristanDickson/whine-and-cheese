import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/lab/Slider";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
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

class RateSlider extends React.Component {
  constructor(props) {
    super();
    this.state = { value: props.score.value };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.metric !== this.props.metric) {
      this.setState({ value: this.props.metric.value });
    }
  }

  handleChange = (updateScore, score) => (event, value) => {
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

RateSlider.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RateSlider);
