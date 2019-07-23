import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import ParticipantSelect from "./ParticipantSelect";

import { connect } from "react-redux";
import {
  fetchParticipants,
  fetchSubjects,
  fetchQuestions,
  fetchSets,
  fetchSetsParticipants,
  addParticipantToSet,
  removeParticipantFromSet
} from "../../State/actions";

const styles = theme => ({
  appFrame: {
    minHeight: 500,
    width: "100%",
    [theme.breakpoints.up(1200 + theme.spacing.unit * 3 * 2)]: {
      width: 1200,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: 5,
    [theme.breakpoints.down("xs")]: {
      width: 125
    }
  },
  fab: {
    margin: theme.spacing.unit
  },
  errorMessage: {
    margin: "10px",
    color: "red"
  }
});

class SetPane extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected_participant_id: "",
      selected_set_id: "",
      validInput: true
    };
  }

  componentDidMount() {
    this.props.fetchParticipants();
    this.props.fetchSets();
    this.props.fetchSetsParticipants();
  }

  changeSet(event) {
    if (event) {
      this.setState({
        selected_set_id: event.value
      });
    } else {
      this.setState({
        selected_set_id: ""
      });
    }
  }

  render() {
    const { classes } = this.props;

    let item = this.props.item;
    let fields = this.props.config.fields;

    return (
      <div
        className={classes.appFrame}
        onKeyPress={event => {
          if (event.key === "Enter") {
            document.activeElement.blur();
          }
        }}
      >
        {item && fields ? (
          <div className={classes.contentPaper}>
            <Grid>
              {fields.map(field => (
                <TextField
                  id={field.elementId}
                  key={fields.indexOf(field)}
                  label={field.displayName}
                  className={classes.textField}
                  margin="normal"
                  value={item[field.fieldName] || ""}
                  onChange={event =>
                    this.props.changeItem(item._id, field.fieldName, event.target.value)
                  }
                  onBlur={event =>
                    this.props.updateItem(item._id, field.fieldName, event.target.value)
                  }
                />
              ))}
            </Grid>
            <Grid>
              <ParticipantSelect set_id={item._id} />
            </Grid>
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = {
  fetchParticipants,
  fetchSubjects,
  fetchQuestions,
  fetchSets,
  fetchSetsParticipants,
  addParticipantToSet,
  removeParticipantFromSet
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SetPane));
