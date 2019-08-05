import React, { Component } from "react";
import {
  Grid,
  Paper,
  Card,
  CardHeader,
  CardContent,
  Typography,
  withStyles,
  createStyles
} from "@material-ui/core";
import WineList from "./WineList";
import RadarChart from "./RadarChart";
import BarChart from "./BarChart";

const styles = (theme: any) =>
  createStyles({
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
  });

interface Props {
  classes: any;
}

interface State {
  metrics: any;
  wineAvgScores: any;
  wineData: any;
}

class ResultsBody extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { metrics: [], wineAvgScores: [], wineData: [] };
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
      `${process.env.REACT_APP_BACKEND_URL}/api/questions`
    );
    let metrics = await response.json();
    return metrics;
  };

  getWineAvgScores = async () => {
    console.log(`Getting wine average scores`);
    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/subject_average_scores`
    );
    let scores = await response.json();
    return scores;
  };

  getWineData = async () => {
    console.log(`Getting wine data`);
    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/subject_data`
    );
    let data = await response.json();
    return data;
  };

  getRandomComment = (classes: any, comments: any) => {
    let filledComments = comments.filter(
      (comment: any) => comment.comment !== ""
    );
    if (filledComments.length > 0) {
      let selectedComment =
        filledComments[Math.floor(Math.random() * filledComments.length)];
      return (
        <div>
          <Typography inline>{`"${selectedComment.comment}" - `}</Typography>
          <Typography inline className={classes.author}>
            {`${selectedComment.participant.firstName} ${
              selectedComment.participant.lastName
            }`}
          </Typography>
        </div>
      );
    } else {
      return (
        <div>
          <Typography>No comments made</Typography>
        </div>
      );
    }
  };

  render() {
    const { classes } = this.props;
    let metrics = this.state.metrics;
    let wines = this.state.wineData;
    let wineAvgScores = this.state.wineAvgScores;

    console.log(metrics);
    console.log(wines);

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
            {wines.map((wine: any) => (
              <Grid key={wine._id} item md={4} xs={12}>
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
                  <CardContent>
                    {this.getRandomComment(classes, wine.comments)}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(ResultsBody);
