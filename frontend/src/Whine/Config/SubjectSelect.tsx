import React, { Component } from "react";
import Select from "react-select";
import { connect } from "react-redux";
import { withStyles, createStyles, WithStyles } from "@material-ui/core/styles";
import { Grid, Fab } from "@material-ui/core";
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

interface StateProps {
  subjects: any;
  sets_subjects: any;
}

interface DispatchProps {
  addSubjectToSet: any;
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

class SubjectSelect extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      options: this.validSubjects(),
      selectedOption: 0
    };
  }

  validSubjects() {
    let set_id = this.props.set_id;
    let subjects = this.props.subjects.subjects;
    let sets_subjects = this.props.sets_subjects.sets_subjects;

    return subjects.filter(
      (subject: any) =>
        !sets_subjects
          .filter((set_subject: any) => {
            return set_subject.set_id === set_id;
          })
          .map((set_subject: any) => {
            return set_subject.subject_id;
          })
          .includes(subject._id)
    );
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.sets_subjects !== prevProps.sets_subjects) {
      this.setState({
        options: this.validSubjects(),
        selectedOption: 0
      });
    }
  }

  changeSubject(event: any) {
    if (event) {
      this.setState({ selectedOption: event.value });
    } else {
      this.setState({ selectedOption: null });
    }
  }

  addToSet() {
    if (this.state.options.length > 0) {
      let set_id = this.props.set_id;
      let subject_id = this.state.options[this.state.selectedOption]._id;

      console.log(
        `Adding subject to set: set_id:${set_id} subject_id:${subject_id}`
      );
      this.props.addSubjectToSet(set_id, subject_id);
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
            onChange={(event: any) => this.changeSubject(event)}
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
        <SubjectList set_id={set_id} />
      </Grid>
    );
  }
}

const mapStateToProps = (state: any): StateProps => {
  const { subjects, sets_subjects } = state;
  return { subjects, sets_subjects };
};

const mapDispatchToProps: DispatchProps = { addSubjectToSet };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SubjectSelect));
