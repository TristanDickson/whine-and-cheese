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
    chart: {
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
    let [metrics, wineAvgScores, wineData] = await Promise.all([
      this.getMetrics(),
      this.getWineAvgScores(),
      this.getWineData()
    ]);
    this.setState({
      metrics: metrics,
      wineAvgScores: wineAvgScores,
      wineData: wineData
    });
  }

  getMetrics = async () => {
    console.log(`Getting metrics`);
    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/metrics`
    );
    let metrics = await response.json();
    return metrics;
  };

  getWineAvgScores = async () => {
    console.log(`Getting wine average scores`);
    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/wine_average_scores`
    );
    let scores = await response.json();
    return scores;
  };

  getWineData = async () => {
    console.log(`Getting wine data`);
    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/wine_data`
    );
    let data = await response.json();
    return data;
  };

  getRandomComment = comments => {
    let filledComments = comments.filter(comment => comment.comment != "");
    console.log(filledComments);
    let selectedComment = filledComments[Math.floor(Math.random() * filledComments.length)];
    return `"${selectedComment.comment}" - ${selectedComment.participant.firstName} ${selectedComment.participant.lastName}`
  }  

  render() {
    const { classes } = this.props;
    let metrics = this.state.metrics;
    let wines = this.state.wineData;
    let wineAvgScores = this.state.wineAvgScores;

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
                  {wineAvgScores && <WineList wines={wineAvgScores} />}
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={8} xs={12}>
              <Card className={classes.card}>
                <CardHeader
                  className={classes.cardHeader}
                  title="Average Wine Scores"
                />
                <CardContent className={classes.chart}>
                  {metrics && wines && (
                    <RadarChart metrics={metrics} wines={wines} />
                  )}
                </CardContent>
              </Card>
            </Grid>
            {metrics &&
              wines &&
              wines.map(wine => (
                <Grid item md={4} xs={12}>
                  <Card className={classes.card}>
                    <CardHeader
                      className={classes.cardHeader}
                      title={wine.name}
                    />
                    <CardContent className={classes.chart}>
                      <BarChart
                        metrics={metrics}
                        wines={wines.slice(
                          [wines.indexOf(wine)],
                          wines.indexOf(wine) + 1
                        )}
                      />
                    </CardContent>
                    <CardContent>{this.getRandomComment(wine.comments)}</CardContent>
                  </Card>
                </Grid>
              ))}
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
