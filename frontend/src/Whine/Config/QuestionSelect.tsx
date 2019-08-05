import React, { Component } from "react";
import Select from "react-select";
import { connect } from "react-redux";
import {
  Grid,
  Fab,
  FormHelperText,
  withStyles,
  createStyles,
  WithStyles
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import { addQuestionToSet } from "../../State/actions";
import QuestionList from "./QuestionList";

const styles = (theme: any) =>
  createStyles({
    select: {
      marginTop: 10
    },
    fab: {
      margin: theme.spacing.unit,
      marginLeft: theme.spacing.unit * 2
    },
    errorMessage: {
      margin: "10px",
      color: "red"
    }
  });

interface StateProps {
  questions: any;
  sets_questions: any;
}

interface DispatchProps {
  addQuestionToSet: any;
}

type Props = WithStyles<typeof styles> &
  StateProps &
  DispatchProps & {
    set_id: string;
  };

interface State {
  validInput: boolean;
  selected_question_id: string;
}

class SubjectSelect extends Component<Props, State> {
  addQuestionToSet: any;

  constructor(props: Props) {
    super(props);
    this.addQuestionToSet = props.addQuestionToSet;
    this.state = {
      selected_question_id: "",
      validInput: true
    };
  }

  changeQuestion(event: any) {
    if (event) {
      this.setState({
        selected_question_id: event.value,
        validInput: true
      });
    } else {
      this.setState({
        selected_question_id: ""
      });
    }
  }

  addToSet(set_id: string, question_id: string) {
    if (question_id !== "") {
      this.setState({ validInput: true });
      this.addQuestionToSet(set_id, question_id);
    } else {
      this.setState({ validInput: false });
    }
  }

  render() {
    const { classes } = this.props;

    let questions = this.props.questions.questions;
    let sets_questions = this.props.sets_questions.sets_questions;

    let set_id = this.props.set_id;
    let selected_question_id = this.state.selected_question_id;

    return (
      <Grid container>
        <Grid item xs={10}>
          <Select
            className={classes.select}
            styles={{
              control: (base, state) =>
                !state.isFocused && !this.state.validInput
                  ? {
                      ...base,
                      border: "1px solid red"
                    }
                  : { ...base }
            }}
            options={questions
              .filter(
                (question: any) =>
                  !sets_questions
                    .filter((set_question: any) => {
                      return set_question.set_id === set_id;
                    })
                    .map((set_question: any) => {
                      return set_question.question_id;
                    })
                    .includes(question._id)
              )
              .map((question: any) => ({
                value: question._id,
                label: `${question.name}`
              }))}
            onChange={(event: any) => this.changeQuestion(event)}
            isClearable={true}
          />
          {!this.state.validInput ? (
            <FormHelperText className={classes.errorMessage}>
              Error: Please select a question
            </FormHelperText>
          ) : (
            ""
          )}
        </Grid>
        <Grid item xs={2}>
          <Fab
            size="small"
            color="primary"
            aria-label="Add"
            className={classes.fab}
            onClick={() => this.addToSet(set_id, selected_question_id)}
          >
            <AddIcon />
          </Fab>
        </Grid>
        <QuestionList set_id={set_id} />
      </Grid>
    );
  }
}

const mapStateToProps = (state: any): StateProps => {
  const { questions, sets_questions } = state;
  return { questions, sets_questions };
};

const mapDispatchToProps: DispatchProps = { addQuestionToSet };

export default connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SubjectSelect));
