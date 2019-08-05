import React, { Component } from "react";
import Select from "react-select";
import { connect } from "react-redux";
import { withStyles, createStyles, WithStyles } from "@material-ui/core/styles";
import { Grid, Fab, FormHelperText } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import { addSubjectToSet } from "../../State/actions";
import SubjectList from "./SubjectList";

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

interface Props extends WithStyles<typeof styles> {
  set_id: string;
  subjects?: any;
  sets_subjects?: any;
  addSubjectToSet?: any;
}

interface State {
  validInput: boolean;
  selected_subject_id: string;
}

class SubjectSelect extends Component<Props, State> {
  addSubjectToSet: any;

  constructor(props: Props) {
    super(props);
    this.addSubjectToSet = props.addSubjectToSet;
    this.state = {
      selected_subject_id: "",
      validInput: true
    };
  }

  changeSubject(event: any) {
    if (event) {
      this.setState({
        selected_subject_id: event.value,
        validInput: true
      });
    } else {
      this.setState({
        selected_subject_id: ""
      });
    }
  }

  addToSet(set_id: string, subject_id: string) {
    if (subject_id !== "") {
      this.setState({ validInput: true });
      this.addSubjectToSet(set_id, subject_id);
      console.log(
        `Adding subject to set: set_id:${set_id} subject_id:${subject_id}`
      );
    } else {
      this.setState({ validInput: false });
    }
  }

  render() {
    const { classes } = this.props;

    let subjects = this.props.subjects.subjects;
    let sets_subjects = this.props.sets_subjects.sets_subjects;

    let set_id = this.props.set_id;
    let selected_subject_id = this.state.selected_subject_id;

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
            options={subjects
              .filter(
                (subject: any) =>
                  !sets_subjects
                    .filter((set_subject: any) => {
                      return set_subject.set_id === set_id;
                    })
                    .map((set_subject: any) => {
                      return set_subject.subject_id;
                    })
                    .includes(subject._id)
              )
              .map((subject: any) => ({
                value: subject._id,
                label: `${subject.name}`
              }))}
            onChange={(event: any) => this.changeSubject(event)}
            isClearable={true}
          />
          {!this.state.validInput ? (
            <FormHelperText className={classes.errorMessage}>
              Error: Please select a subject
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
            onClick={() => this.addToSet(set_id, selected_subject_id)}
          >
            <AddIcon />
          </Fab>
        </Grid>
        <SubjectList set_id={set_id} />
      </Grid>
    );
  }
}

const mapStateToProps = (state: any) => ({ ...state });

const mapDispatchToProps = { addSubjectToSet };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SubjectSelect));
