import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import Select from "react-select";

import { connect } from "react-redux";
import {
  fetchParticipants,
  fetchWines,
  fetchMetrics,
  addParticipantToSet
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
  select: {
    //width: 200
  },
  button: {
    margin: theme.spacing.unit
  }
});

class SetPane extends Component {
  constructor(props) {
    super();
    this.fetchParticipants = props.fetchParticipants;
    this.fetchWines = props.fetchWines;
		this.fetchMetrics = props.fetchMetrics;
		this.addParticipantToSet = props.addParticipantToSet;
  }

  componentDidMount() {
    this.fetchParticipants();
    this.fetchWines();
    this.fetchMetrics();
  }

  render() {
    const { classes } = this.props;
    let item = this.props.item;
    let fields = this.props.config.fields;
    let participants = this.props.participants.participants;
    let wines = this.props.wines.wines;
    let metrics = this.props.metrics.metrics;

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
                    this.props.changeItem(
                      item._id,
                      field.fieldName,
                      event.target.value
                    )
                  }
                  onBlur={event =>
                    this.props.updateItem(
                      item._id,
                      field.fieldName,
                      event.target.value
                    )
                  }
                />
              ))}
            </Grid>
            <Grid container spacing={24}>
              <Grid item md={4} xs={12}>
                <Select
                  className={classes.select}
                  options={participants.map(participant => ({
                    value: participant._id,
                    label: `${participant.firstName} ${participant.lastName}`
                  }))}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <Select
                  className={classes.select}
                  options={wines.map(wine => ({
                    value: wine._id,
                    label: wine.name
                  }))}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <Select
                  className={classes.select}
                  options={metrics.map(metric => ({
                    value: metric._id,
                    label: metric.name
                  }))}
                />
              </Grid>
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
  fetchWines,
  fetchMetrics,
  addParticipantToSet
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SetPane));
