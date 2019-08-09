import React, { Component, Fragment } from "react";
import {
  Grid,
  Fab,
  Typography,
  withStyles,
  createStyles,
  WithStyles
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

import { connect } from "react-redux";
import { removeQuestionFromSet } from "../../State/actions";

const styles = (theme: any) =>
  createStyles({
    fab: {
      margin: theme.spacing.unit,
      marginLeft: theme.spacing.unit
    },
    typography: {
      display: "block",
      marginLeft: 20,
      marginTop: 20
    }
  });

interface Props extends WithStyles<typeof styles> {
  questions?: any;
  set_id?: string;
  sets_questions?: any;
  removeQuestionFromSet?: any;
}

interface State {
  validInput: boolean;
  selected_question_id: string;
}

class SubjectList extends Component<Props, State> {
  removeQuestionFromSet: any;

  constructor(props: Props) {
    super(props);
    this.removeQuestionFromSet = props.removeQuestionFromSet;
  }

  removeFromSet(set_question_id: string) {
    this.props.removeQuestionFromSet(set_question_id);
  }

  render() {
    const { classes } = this.props;

    let questions = this.props.questions.questions;
    let sets_questions = this.props.sets_questions.sets_questions;

    let set_id = this.props.set_id;

    return sets_questions
      .filter((set_question: any) => set_question.set_id === set_id)
      .map((set_question: any) => (
        <Fragment key={set_question._id}>
          <Grid item xs={1}/>
          <Grid item xs={9}>
            <Typography className={classes.typography} >
              {[
                questions.find(
                  (question: any) => question._id === set_question.question_id
                )
              ].map(question => `${question.name}`)}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Fab
              size="small"
              color="secondary"
              aria-label="Add"
              className={classes.fab}
              onClick={() => this.removeFromSet(set_question._id)}
            >
              <DeleteIcon />
            </Fab>
          </Grid>
        </Fragment>
      ));
  }
}

const mapStateToProps = (state: any) => ({ ...state });

const mapDispatchToProps = { removeQuestionFromSet };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SubjectList));
