import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, Fab } from "@material-ui/core";
import { withStyles, createStyles, WithStyles } from "@material-ui/core/styles";
import { Add as AddIcon } from "@material-ui/icons";
import Select from "react-select";

import { addParticipantToSet } from "../../State/actions";
import ParticipantList from "./ParticipantList";

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
  participants: any;
  sets_participants: any;
}

interface DispatchProps {
  addParticipantToSet: any;
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

class ParticipantSelect extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      options: this.validParticipants(),
      selectedOption: 0
    };
  }

  validParticipants() {
    let set_id = this.props.set_id;
    let participants = this.props.participants.participants;
    let sets_participants = this.props.sets_participants.sets_participants;

    return participants.filter(
      (participant: any) =>
        !sets_participants
          .filter((set_participant: any) => {
            return set_participant.set_id === set_id;
          })
          .map((set_participant: any) => {
            return set_participant.participant_id;
          })
          .includes(participant._id)
    );
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.sets_participants !== prevProps.sets_participants) {
      this.setState({
        options: this.validParticipants(),
        selectedOption: 0
      });
    }
  }

  changeParticipant(event: any) {
    if (event) {
      this.setState({ selectedOption: event.value });
    } else {
      this.setState({ selectedOption: null });
    }
  }

  addToSet() {
    if (this.state.options.length > 0) {
      let set_id = this.props.set_id;
      let participant_id = this.state.options[this.state.selectedOption]._id;

      console.log(
        `Adding participant to set: set_id:${set_id} participant_id:${participant_id}`
      );
      this.props.addParticipantToSet(set_id, participant_id);
    }
  }

  render() {
    const { classes } = this.props;

    let set_id = this.props.set_id;

    let options = this.state.options.map((option: any) => ({
      value: this.state.options.indexOf(option),
      label: `${option.firstName} ${option.lastName}`
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
            onChange={(event: any) => this.changeParticipant(event)}
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
        <ParticipantList set_id={set_id} />
      </Grid>
    );
  }
}

const mapStateToProps = (state: any): StateProps => {
  const { participants, sets_participants } = state;
  return { participants, sets_participants };
};

const mapDispatchToProps: DispatchProps = { addParticipantToSet };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ParticipantSelect));
