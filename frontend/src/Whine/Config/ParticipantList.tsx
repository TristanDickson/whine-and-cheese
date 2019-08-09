import React, { Component, Fragment } from "react";
import { withStyles, createStyles, WithStyles } from "@material-ui/core/styles";
import { Typography, Tooltip } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import { Delete as DeleteIcon, Link as LinkIcon } from "@material-ui/icons";

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
    },
    button: {
      margin: theme.spacing.unit
    }
  });

const copyLink = (code: string) => {
  const doc: any = document;

  const el = doc.createElement("textarea");
  el.value = `${new URL(window.location.href).origin}/rate?${code}`;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  doc.body.appendChild(el);
  const selected =
    doc.getSelection().rangeCount > 0
      ? doc.getSelection().getRangeAt(0)
      : false;
  el.select();
  doc.execCommand("copy");
  doc.body.removeChild(el);
  if (selected) {
    doc.getSelection().removeAllRanges();
    doc.getSelection().addRange(selected);
  }
};

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

  componentDidUpdate = () => {};

  removeFromSet(
    set_participant_id: string,
    set_id: string,
    participant_id: string
  ) {
    this.props.removeParticipantFromSet(
      set_participant_id,
      set_id,
      participant_id
    );
  }

  render() {
    const { classes } = this.props;

    let participants = this.props.participants.participants;
    let sets_participants = this.props.sets_participants.sets_participants;

    let set_id = this.props.set_id;

    return sets_participants
      .filter((set_participant: any) => set_participant.set_id === set_id)
      .map((set_participant: any) => (
        <Fragment key={set_participant._id}>
          <Grid item xs={1} />
          <Grid item xs={8}>
            <Typography className={classes.typography}>
              {[
                participants.find(
                  (participant: any) =>
                    participant._id === set_participant.participant_id
                )
              ].map(participant =>
                participant
                  ? `${participant.firstName} ${participant.lastName}`
                  : null
              )}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Fab
              size="small"
              color="secondary"
              aria-label="Add"
              className={classes.fab}
              onClick={() =>
                this.removeFromSet(
                  set_participant._id,
                  set_participant.set_id,
                  set_participant.participant_id
                )
              }
            >
              <DeleteIcon />
            </Fab>
            <Tooltip title="Copy Link">
              <Fab
                size="small"
                color="primary"
                aria-label="Link"
                className={classes.button}
                onClick={() => copyLink(set_participant.code)}
              >
                <LinkIcon />
              </Fab>
            </Tooltip>
          </Grid>
          <Grid item xs={1} />
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
