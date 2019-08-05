import React, { Component } from "react";
import {
  Button,
  Paper,
  Step,
  Stepper,
  StepLabel,
  CircularProgress,
  withStyles,
  createStyles,
  Theme,
  WithStyles
} from "@material-ui/core";
import RateSliders from "./RateSliders";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing.unit,
      padding: theme.spacing.unit
    },
    button: {
      marginRight: theme.spacing.unit
    },
    instructions: {
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit
    },
    stepperControls: {
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
      textAlign: "center"
    },
    stepperLabel: {
      [theme.breakpoints.down("xs")]: {
        width: "0px",
        whiteSpace: "nowrap",
        overflow: "hidden"
      }
    }
  });

interface Props extends WithStyles<typeof styles> {
  participant: any;
}

interface State {
  activeStep: number;
  wines: any;
}

class RateStepper extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { activeStep: 0, wines: [] };
    console.log(`participant: ${JSON.stringify(props.participant)}`);
  }

  async componentDidMount() {
    await this.getParticipantData(this.props.participant);
    await this.state.wines.forEach((wine: any) => {
      if (!wine.comment) {
        this.createComment(this.props.participant._id, wine.wine._id);
      }
    });
    await this.getParticipantData(this.props.participant);
  }

  getParticipantData = async (participant: any) => {
    await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/participant_data?id=${
        participant._id
      }`
    )
      .then(response => {
        return response.json();
      })
      .then(wines => {
        console.log(wines);
        this.setState({ wines: [...wines] });
      });
  };

  saveParticipantData = (wine: any) => {
    wine.scores.forEach((score: number) => this.saveScore(score));
    this.saveComment(wine.comment);
  };

  saveScore = (score: any) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/answers`, {
      method: "put",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        _id: score._id,
        value: score.value
      })
    }).then(res => {
      if (res.ok) return res.json();
    });
  };

  createComment = (participant_id: number, wine_id: number) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/comments`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        participant_id: participant_id,
        wine_id: wine_id,
        comment: ""
      })
    }).then(res => {
      if (res.ok) return res.json();
    });
  };

  saveComment = (comment: any) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/comments`, {
      method: "put",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        _id: comment._id,
        value: comment.comment
      })
    }).then(res => {
      if (res.ok) return res.json();
    });
  };

  updateScore = (wine: any) => (score: any, value: any) => {
    let newState = { ...this.state };
    let newWine = newState.wines.find((_wine: any) => _wine === wine);
    let newScore = newWine.scores.find((_score: any) => _score === score);
    newScore.value = value;
    this.setState(newState);
  };

  updateComment = (wine: any) => (value: any) => {
    let newState = { ...this.state };
    let newWine = newState.wines.find((_wine: any) => _wine === wine);
    newWine.comment.comment = value;
    this.setState(newState);
  };

  handleNext = () => {
    if (this.state.activeStep > 0) {
      this.saveParticipantData(this.state.wines[this.state.activeStep - 1]);
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

  progressButtonText = (activeStep: number, totalSteps: any) => {
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
    const { activeStep } = this.state;
    const participantName = this.props.participant.firstName;
    const wines = this.state.wines;

    return (
      <Paper className={classes.root}>
        {wines ? (
          <div>
            <Stepper activeStep={activeStep - 1}>
              {wines.map((wine: any) => {
                return (
                  <Step key={wine.wine._id}>
                    <StepLabel>
                      <div className={classes.stepperLabel}>
                        {wine.wine.label}
                      </div>
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
              updateComment={this.updateComment(wines[activeStep - 1])}
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
          <CircularProgress />
        )}
      </Paper>
    );
  }
}

export default withStyles(styles)(RateStepper);
