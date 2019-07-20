import React, { Component} from "react";
import Select from "react-select";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import FormHelperText from "@material-ui/core/FormHelperText";

import { addParticipantToSet } from "../../State/actions";
import ParticipantList from "./ParticipantList";

const styles = theme => ({
  select: {
    marginTop: 10
  },
  fab: {
		margin: theme.spacing.unit,
		marginLeft: theme.spacing.unit*2
  },
  errorMessage: {
    margin: "10px",
    color: "red"
  }
});

class SetPane extends Component {
  constructor(props) {
    super();
    this.addParticipantToSet = props.addParticipantToSet;
    this.state = {
      selected_participant_id: "",
      validInput: true
    };
  }

  changeParticipant(event) {
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

  addToSet(set_id, participant_id) {
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
            options={participants
              .filter(
                participant =>
                  !sets_participants
                    .filter(set_participant => {
                      return set_participant.set_id === set_id;
                    })
                    .map(set_participant => {
                      return set_participant.participant_id;
                    })
                    .includes(participant._id)
              )
              .map(participant => ({
                value: participant._id,
                label: `${participant.firstName} ${participant.lastName}`
              }))}
            onChange={event => this.changeParticipant(event)}
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

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = { addParticipantToSet };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SetPane));
