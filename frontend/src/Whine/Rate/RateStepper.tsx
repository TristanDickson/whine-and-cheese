import React, { Component } from "react";
import {
  Button,
  Paper,
  Step,
  Stepper,
  StepLabel,
  withStyles,
  createStyles,
  Theme,
  WithStyles
} from "@material-ui/core";
import RateQuestions from "./RateQuestions";

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
  set_participant: any;
}

interface State {
  activeStep: number;
  subjects: any;
}

class RateStepper extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { activeStep: 0, subjects: [] };
  }

  async componentDidMount() {
    await this.getParticipantData(this.props.set_participant);
  }

  getParticipantData = async (set_participant: any) => {
    await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/participant_data?set_id=${
        set_participant.set_id
      }&participant_id=${set_participant.participant_id}`
    )
      .then(response => {
        return response.json();
      })
      .then(subjects => {
        this.setState({ subjects: [...subjects] });
      });
  };

  saveParticipantData = (subject: any) => {
    subject.answers.forEach((answer: number) => this.saveAnswer(answer));
  };

  saveAnswer = (answer: any) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/answers`, {
      method: "put",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        _id: answer._id,
        key: "value",
        value: answer.value
      })
    });
  };

  updateAnswer = (subject: any) => (answer: any, value: any) => {
    let newState = { ...this.state };
    let newSubject = newState.subjects.find(
      (_subject: any) => _subject === subject
    );
    let newAnswer = newSubject.answers.find(
      (_answer: any) => _answer === answer
    );
    newAnswer.value = value;
    this.setState(newState);
  };

  handleNext = () => {
    if (this.state.activeStep > 0) {
      this.saveParticipantData(this.state.subjects[this.state.activeStep - 1]);
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
    const participantName = this.props.set_participant.participant.firstName;
    const subjects = this.state.subjects;

    return (
      <Paper className={classes.root}>
        <div>
          <Stepper activeStep={activeStep - 1}>
            {subjects.map((subject: any) => {
              return (
                <Step key={subject.subject._id}>
                  <StepLabel>
                    <div className={classes.stepperLabel}>
                      {subject.subject.label}
                    </div>
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
          <RateQuestions
            key="RateQuestions1"
            participantName={participantName}
            subject={subjects[activeStep - 1]}
            start={activeStep === 0}
            updateAnswer={this.updateAnswer(subjects[activeStep - 1])}
          />
          <div className={classes.stepperControls}>
            {activeStep === subjects.length + 1 ? (
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
                    {this.progressButtonText(activeStep, subjects.length)}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(RateStepper);
