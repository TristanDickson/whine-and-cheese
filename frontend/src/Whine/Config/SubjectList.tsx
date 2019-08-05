import React, { Component, Fragment } from "react";
import { withStyles, createStyles, WithStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import DeleteIcon from "@material-ui/icons/Delete";

import { connect } from "react-redux";
import { removeSubjectFromSet } from "../../State/actions";

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
  subjects?: any;
  set_id?: string;
  sets_subjects?: any;
  removeSubjectFromSet?: any;
}

interface State {
  validInput: boolean;
  selected_subject_id: string;
}

class SubjectList extends Component<Props, State> {
  removeSubjectFromSet: any;

  constructor(props: Props) {
    super(props);
    this.removeSubjectFromSet = props.removeSubjectFromSet;
  }

  removeFromSet(set_subject_id: string) {
    this.props.removeSubjectFromSet(set_subject_id);
  }

  render() {
    const { classes } = this.props;

    let subjects = this.props.subjects.subjects;
    let sets_subjects = this.props.sets_subjects.sets_subjects;

    let set_id = this.props.set_id;

    return sets_subjects
      .filter((set_subject: any) => set_subject.set_id === set_id)
      .map((set_subject: any) => (
        <Fragment>
          <Grid item xs={10}>
            <Typography className={classes.typography} key={set_subject._id}>
              {[
                subjects.find(
                  (subject: any) => subject._id === set_subject.subject_id
                )
              ].map(subject => `${subject.name}`)}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Fab
              size="small"
              color="primary"
              aria-label="Add"
              className={classes.fab}
              onClick={() => this.removeFromSet(set_subject._id)}
            >
              <DeleteIcon />
            </Fab>
          </Grid>
        </Fragment>
      ));
  }
}

const mapStateToProps = (state: any) => ({ ...state });

const mapDispatchToProps = { removeSubjectFromSet };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SubjectList));
