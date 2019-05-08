import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import RateSliders from "./RateSliders";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = theme => ({
  root: {
    margin: theme.spacing.unit,
    padding: theme.spacing.unit
  },
  title: {},
  button: {
    marginRight: theme.spacing.unit
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  stepperControls: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  stepperLabel: {
    [theme.breakpoints.down("xs")]: {
      width: "0px",
      whiteSpace: "nowrap",
      overflow: "hidden"
    }
  }
});

class RateStepper extends React.Component {
  constructor() {
    super();
    this.state = { activeStep: 0 };
  }

  componentDidMount() {
    this.getScores();
  }

  getScores = async () => {
    fetch(
      `http://localhost:5000/participant_scores?id=${this.props.participant_id}`
    )
      .then(response => {
        return response.json();
      })
      .then(wines => {
        let data = [];
        wines.forEach(wine => {
          let row = {
            id: wine._id.wine._id,
            name: wine._id.wine.name,
            metrics: []
          };
          wine.scores.forEach(score => {
            row.metrics.push({
              name: score.metric.name,
              id: score.id,
              value: score.value
            });
          });
          data.push(row);
        });
        console.log(data);
        this.setState({ ...this.state, wines: [...data] });
      });
  };

  updateScore = wine => (metric, value) => {
    let newState = { ...this.state };
    let newWine = newState.wines.find(_wine => _wine === wine);
    let newMetric = newWine.metrics.find(_metric => _metric === metric);
    newMetric.value = value;
    this.setState(newState);
  };

  saveScores = metrics => {
    metrics.forEach(metric => this.saveScore(metric.id, metric.value));
  };

  saveScore = (id, value) => {
    fetch("http://localhost:5000/scores", {
      method: "put",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        _id: id,
        value: value
      })
    }).then(res => {
      if (res.ok) return res.json();
    });
  };

  handleNext = () => {
    this.saveScores(this.state.wines[this.state.activeStep].metrics);
    this.setState(state => ({
      activeStep: state.activeStep + 1
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0
    });
  };

  render() {
    const { classes } = this.props;
    const { activeStep } = this.state;
    const wines = this.state.wines;

    return (
      <Paper align="center" className={classes.root}>
        {wines ? (
          <div>
            <Stepper activeStep={activeStep}>
              {wines.map(wine => {
                return (
                  <Step key={wine.name}>
                    <StepLabel>
                      <div className={classes.stepperLabel}>{wine.name}</div>
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            <RateSliders
              wine={wines[activeStep]}
              updateScore={this.updateScore(wines[activeStep])}
            />
            <div className={classes.stepperControls}>
              {activeStep === wines.length ? (
                <div>
                  <Button onClick={this.handleReset} className={classes.button}>
                    Reset
                  </Button>
                </div>
              ) : (
                <div>
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      onClick={this.handleBack}
                      className={classes.button}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleNext}
                      className={classes.button}
                    >
                      {activeStep === wines.length - 1 ? "Finish" : "Next"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <CircularProgress className={classes.progress} />
        )}
      </Paper>
    );
  }
}

RateStepper.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(RateStepper);
