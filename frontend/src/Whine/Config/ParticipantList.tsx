import React, { Component, Fragment } from "react";
import { withStyles, createStyles, WithStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import DeleteIcon from "@material-ui/icons/Delete";

import { connect } from "react-redux";
import { removeParticipantFromSet } from "../../State/actions";

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
  participants?: any;
  set_id?: string;
  sets_participants?: any;
  removeParticipantFromSet?: any;
}

interface State {
  validInput: boolean;
  selected_participant_id: string;
}

class SetPane extends Component<Props, State> {
  removeParticipantFromSet: any;

  constructor(props: Props) {
    super(props);
    this.removeParticipantFromSet = props.removeParticipantFromSet;
  }

  removeFromSet(set_participant_id: string) {
    this.props.removeParticipantFromSet(set_participant_id);
  }

  render() {
    const { classes } = this.props;

    let participants = this.props.participants.participants;
    let sets_participants = this.props.sets_participants.sets_participants;

    let set_id = this.props.set_id;

    return sets_participants
      .filter((set_participant: any) => set_participant.set_id === set_id)
      .map((set_participant: any) => (
        <Fragment>
          <Grid item xs={10}>
            <Typography
              className={classes.typography}
              key={set_participant._id}
            >
              {[
                participants.find(
                  (participant: any) =>
                    participant._id === set_participant.participant_id
                )
              ].map(
                participant =>
                  `${participant.firstName} ${participant.lastName}`
              )}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Fab
              size="small"
              color="primary"
              aria-label="Add"
              className={classes.fab}
              onClick={() => this.removeFromSet(set_participant._id)}
            >
              <DeleteIcon />
            </Fab>
          </Grid>
        </Fragment>
      ));
  }
}

const mapStateToProps = (state: any) => ({ ...state });

const mapDispatchToProps = { removeParticipantFromSet };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SetPane));
