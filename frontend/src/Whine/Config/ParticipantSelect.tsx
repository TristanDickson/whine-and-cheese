import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, Fab, FormHelperText } from "@material-ui/core";
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

interface Props extends WithStyles<typeof styles> {
  set_id: string;
  participants?: any;
  sets_participants?: any;
  addParticipantToSet?: any;
}

interface State {
  validInput: boolean;
  selected_participant_id: string;
}

class ParticipantSelect extends Component<Props, State> {
  addParticipantToSet: any;

  constructor(props: Props) {
    super(props);
    this.addParticipantToSet = props.addParticipantToSet;
    this.state = {
      selected_participant_id: "",
      validInput: true
    };
  }

  changeParticipant(event: any) {
    if (event) {
      this.setState({
        selected_participant_id: event.value,
        validInput: true
      });
    } else {
      this.setState({
        selected_participant_id: ""
      });
    }
  }

  addToSet(set_id: string, participant_id: string) {
    if (participant_id !== "") {
      this.setState({ validInput: true });
      this.addParticipantToSet(set_id, participant_id);
    } else {
      this.setState({ validInput: false });
    }
  }

  render() {
    const { classes } = this.props;

    let participants = this.props.participants.participants;
    let sets_participants = this.props.sets_participants.sets_participants;

    let set_id = this.props.set_id;
    let selected_participant_id = this.state.selected_participant_id;

    return (
      <Grid container>
        <Grid item xs={1} />
        <Grid item xs={9}>
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
            options={participants
              .filter(
                (participant: any) =>
                  !sets_participants
                    .filter((set_participant: any) => {
                      return set_participant.set_id === set_id;
                    })
                    .map((set_participant: any) => {
                      return set_participant.participant_id;
                    })
                    .includes(participant._id)
              )
              .map((participant: any) => ({
                value: participant._id,
                label: `${participant.firstName} ${participant.lastName}`
              }))}
            onChange={(event: any) => this.changeParticipant(event)}
            isClearable={true}
          />
          {!this.state.validInput ? (
            <FormHelperText className={classes.errorMessage}>
              Error: Please select a participant
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
            onClick={() => this.addToSet(set_id, selected_participant_id)}
          >
            <AddIcon />
          </Fab>
        </Grid>
        <ParticipantList set_id={set_id} />
      </Grid>
    );
  }
}

const mapStateToProps = (state: any) => ({ ...state });

const mapDispatchToProps = { addParticipantToSet };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ParticipantSelect));
