import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import WineList from "./WineList";
import RadarChart from "./RadarChart";
import BarChart from "./BarChart";

const styles = theme => {
  return {
    root: {},
    layout: {
      width: "auto",
      //marginLeft: theme.spacing.unit * 3,
      //marginRight: theme.spacing.unit * 3,
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
    reviewHeader: {
      //backgroundColor: theme.palette.primary
    },
    reviewHeaderGrid: {
      margin: 0,
      width: "100%",
      height: "100%"
    },
    cardHeader: {
      textAlign: "center"
    },
    radarChart: {
      padding: "5px"
    },
    wineList: {
      paddingTop: 0
    }
  };
};

class ResultsBody extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  async componentDidMount() {
    let [metrics, metricScores, wineScores] = await Promise.all([
      this.getMetrics(),
      this.getScoresByMetric(),
      this.getScoresByWine()
    ]);
    this.setState({
      metrics: metrics,
      metricScores: metricScores,
      wineScores: wineScores
    });
  }

  getMetrics = async () => {
    console.log(`Getting metrics`);
    let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/metrics`);
    let metrics = await response.json();
    return metrics;
  };

  getScoresByMetric = async () => {
    console.log(`Getting metric scores`);
    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/average_scores_by_metric`
    );
    let scores = await response.json();
    return scores;
  };

  getScoresByWine = async () => {
    console.log(`Getting wine scores`);
    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/average_scores_by_wine`
    );
    let scores = await response.json();
    return scores;
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.layout}>
        <Paper className={classes.reviewHeader}>
          <Grid className={classes.reviewHeaderGrid} container spacing={24}>
            <Grid item md={4} xs={12}>
              <Card className={classes.card}>
                <CardHeader
                  className={classes.cardHeader}
                  title="Wine Ranking"
                />
                <CardContent className={classes.wineList}>
                  {this.state.wineScores && (
                    <WineList wines={this.state.wineScores} />
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={8} xs={12}>
              <Card className={classes.card}>
                <CardHeader
                  className={classes.cardHeader}
                  title="Average Wine Scores"
                />
                <CardContent className={classes.radarChart}>
                  {this.state.metrics && this.state.metricScores && (
                    <RadarChart
                      metrics={this.state.metrics}
                      wines={this.state.metricScores}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={4} xs={12}>
              <Card className={classes.card}>
                <CardHeader
                  className={classes.cardHeader}
                  title="Wine 1"
                />
                <CardContent className={classes.radarChart}>
                  {this.state.metrics && this.state.metricScores && (
                    <BarChart/>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

ResultsBody.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ResultsBody);
