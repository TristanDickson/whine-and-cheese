import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

import { connect } from "react-redux";

import { fetchParticipants } from '../State/actions';

const styles = theme => {
  return {
    root: {},
    layout: {
      width: "auto",
      [theme.breakpoints.up(1200 + theme.spacing.unit * 3 * 2)]: {
        width: 1200,
        marginLeft: "auto",
        marginRight: "auto"
      }
    },
    button: {
      margin: theme.spacing.unit,
      backgroundColor: "#ffc107"
    },
    reviewHeader: {},
    reviewHeaderGrid: {
      margin: 0,
      width: "100%",
      height: "100%"
    },
    cardHeader: {
      textAlign: "center"
    },
    chart: {
      padding: "5px"
    },
    wineList: {
      paddingTop: 0
    },
    author: {
      fontStyle: "italic"
    }
  };
};

class Participants extends React.Component {
  render() {
    const { classes, fetchParticipants } = this.props;
    const { isLoading, error, participants } = this.props.participants;

    return (
      <div className={classes.layout}>
        <Paper className={classes.reviewHeader}>
          <button onClick={fetchParticipants}>Fetch participants</button>
          {isLoading && <h1>Fetching data</h1>}
          {!isLoading &&
            !error &&
            participants.map(participant => (
              <Grid className={classes.reviewHeaderGrid} container spacing={24}>
                <Grid key={participant._id} item md={4} xs={12}>
                  <Card className={classes.card}>
                    <CardHeader
                      className={classes.cardHeader}
                      title={`${participant.firstName} ${participant.lastName}`}
                    />
                    <CardContent className={classes.chart}>
                      {`Participant's code is ${participant.code}`}
                    </CardContent>
                    <CardContent>
                      {`Participant is ${participant.age} years old`}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            ))}
          {error && <h1>{error}</h1>}
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = state => ({ ...state });
const mapDispatchToProps = { fetchParticipants };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Participants));
