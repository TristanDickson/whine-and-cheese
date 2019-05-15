import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import RadarChart from "./RadarChart";

const styles = theme => {
  return {
    root: {},
    layout: {
      width: "auto",
      marginLeft: theme.spacing.unit * 3,
      marginRight: theme.spacing.unit * 3,
      [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
        width: 1100,
        marginLeft: "auto",
        marginRight: "auto"
      }
    },
    button: {
      margin: theme.spacing.unit,
      backgroundColor: "#ffc107"
    },
    reviewHeader: {
      margin: 2 * theme.spacing.unit,
      backgroundColor: theme.palette.primary
    },
    reviewHeaderGrid: {
      margin: 0,
      width: "100%",
      height: "100%"
    }
  };
};

class ResultsBody extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  async componentDidMount() {
    let [metrics, scores] = await Promise.all([
      this.getMetrics(),
      this.getScores()
    ]);
    this.state = {metrics: metrics, scores: scores};
    
    console.log(this.state);
  }

  getMetrics = async () => {
    console.log(`Getting metrics`);
    let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/metrics`);
    let metrics = await response.json();
    return metrics;
  };

  getScores = async () => {
    console.log(`Getting scores`);
    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/average_scores`
    );
    let scores = await response.json();
    return scores;
  };

  render() {
    const { classes } = this.props;
    console.log(this.state.metrics);
    console.log(this.state.scores);

    return (
      <div className={classes.layout}>
        <main>
          <Paper className={classes.reviewHeader}>
            <Grid className={classes.reviewHeaderGrid} container spacing={24}>
              <Grid item xs={8}>
                <Card className={classes.card}>
                  <CardHeader title="Average Wine Scores" />
                  <CardContent>
                    {this.state.metric && this.state.scores && (
                      <RadarChart
                        metric={this.state.metrics}
                        scores={this.state.scores}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card className={classes.card}>
                  <CardHeader title="Wine Ranking" />
                  <CardContent />
                </Card>
              </Grid>
            </Grid>
          </Paper>
          <Paper className={classes.reviewHeader}>
            <Grid className={classes.reviewHeaderGrid} container spacing={24}>
              <Grid item xs={6}>
                <Card className={classes.card}>
                  <CardHeader title="Would you recommend True Grit to friends and family?" />
                  <CardContent />
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card className={classes.card}>
                  <CardHeader title="Reviewer's Quote" />
                  <CardContent>
                    <Typography component="p">
                      "A good adventure film. The characters and setting were
                      done well which made the story absorbing. Not my usual
                      genre but I enjoyed it."
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </main>
      </div>
    );
  }
}

ResultsBody.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ResultsBody);
