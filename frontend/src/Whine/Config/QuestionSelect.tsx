import React, { Component } from "react";
import Select from "react-select";
import { connect } from "react-redux";
import {
  Grid,
  Fab,
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
    options: any;
    selectedOption: any;
  }
  
  class QuestionSelect extends Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
        options: this.validQuestions(),
        selectedOption: 0
      };
    }
  
    validQuestions() {
      let set_id = this.props.set_id;
      let questions = this.props.questions.questions;
      let sets_questions = this.props.sets_questions.sets_questions;
  
      return questions.filter(
        (question: any) =>
          !sets_questions
            .filter((set_question: any) => {
              return set_question.set_id === set_id;
            })
            .map((set_question: any) => {
              return set_question.question_id;
            })
            .includes(question._id)
      );
    }
  
    componentDidUpdate(prevProps: Props) {
      if (this.props.sets_questions !== prevProps.sets_questions) {
        this.setState({
          options: this.validQuestions(),
          selectedOption: 0
        });
      }
    }
  
    changeQuestion(event: any) {
      if (event) {
        this.setState({ selectedOption: event.value });
      } else {
        this.setState({ selectedOption: null });
      }
    }
  
    addToSet() {
      if (this.state.options.length > 0) {
        let set_id = this.props.set_id;
        let question_id = this.state.options[this.state.selectedOption]._id;
  
        console.log(
          `Adding question to set: set_id:${set_id} question_id:${question_id}`
        );
        this.props.addQuestionToSet(set_id, question_id);
      }
    }
  
    render() {
      const { classes } = this.props;
  
      let set_id = this.props.set_id;
  
      let options = this.state.options.map((option: any) => ({
        value: this.state.options.indexOf(option),
        label: option.name
      }));
      let value = options[this.state.selectedOption];
  
      return (
        <Grid container>
          <Grid item xs={1} />
          <Grid item xs={9}>
            <Select
              className={classes.select}
              value={value}
              options={options}
              onChange={(event: any) => this.changeQuestion(event)}
              isClearable={true}
            />
          </Grid>
          <Grid item xs={2}>
            <Fab
              size="small"
              color="primary"
              aria-label="Add"
              className={classes.fab}
              onClick={() => this.addToSet()}
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
)(withStyles(styles)(QuestionSelect));
