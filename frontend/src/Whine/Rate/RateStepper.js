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
  constructor(props) {
    super();
    this.state = { activeStep: 0, wines: null };
    console.log(props.participant);
  }

  async componentDidMount() {
    await this.getParticipantData();
  }

  getParticipantData = async () => {
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}/participant_scores?id=${
        this.props.participant._id
      }`
    )
      .then(response => {
        return response.json();
      })
      .then(wines => {
        console.log(wines);
        this.setState({ ...this.state, wines: [...wines] });
      });
  };

  saveParticipantData = (scores, comment) => {
    scores.forEach(score => this.saveScore(score.id, score.value));
    this.saveComment(comment.id, comment.value);
  };

  saveScore = (id, value) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/scores`, {
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

  saveComment = (id, value) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/comments`, {
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

  updateScore = wine => (metric, value) => {
    let newState = { ...this.state };
    let newWine = newState.wines.find(_wine => _wine === wine);
    let newMetric = newWine.metrics.find(_metric => _metric === metric);
    newMetric.value = value;
    this.setState(newState);
  };

  updateComment = wine => comment => {
    let newState = { ...this.state };
    let newWine = newState.wines.find(_wine => _wine === wine);
    let newMetric = newWine.metrics.find(_metric => _metric === metric);
    newMetric.value = value;
    this.setState(newState);
  };

  handleNext = () => {
    if (this.state.activeStep > 0) {
      this.saveParticipantData(this.state.wines[this.state.activeStep - 1].metrics);
    }
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

  progressButtonText = (activeStep, totalSteps) => {
    if (activeStep === 0) {
      return "Start";
    } else if (activeStep === totalSteps) {
      return "Finish";
    } else {
      return "Next";
    }
  };

  render() {
    const { classes } = this.props;
    const participantName = this.props.participant.firstName;
    const { activeStep } = this.state;
    const wines = this.state.wines;

    return (
      <Paper align="center" className={classes.root}>
        {wines ? (
          <div>
            <Stepper activeStep={activeStep - 1}>
              {wines.map(wine => {
                return (
                  <Step key={wine.label}>
                    <StepLabel>
                      <div className={classes.stepperLabel}>{wine.label}</div>
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            <RateSliders
              participantName={participantName}
              wine={wines[activeStep - 1]}
              start={activeStep === 0}
              updateScore={this.updateScore(wines[activeStep - 1])}
              updateComment={this.updateComment(wines[activeStep -1])}
            />
            <div className={classes.stepperControls}>
              {activeStep === wines.length + 1 ? (
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
                      {this.progressButtonText(activeStep, wines.length)}
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
