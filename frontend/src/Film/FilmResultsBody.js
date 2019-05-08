import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import banner from "./review-header.jpg";
import poster from "./poster.jpg";
import jeff3 from "./jeff-3.png";
import Button from "@material-ui/core/Button";
import Banner from "../Banner";
import PieChart from "./FilmResultsPieChart";
import BarChart from "./FilmResultsBarChart";

let film = {
  title: "True Grit",
  imdbTag: "tt1403865",
  description:
    "A stubborn teenager enlists the help of a tough U.S. Marshal to track down her father's murderer."
};

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
    bannerContainer: {
      height: "30vh"
    },
    reviewHeader: {
      margin: 2 * theme.spacing.unit,
      height: "25vh",
      backgroundColor: theme.palette.primary
    },
    reviewHeaderGrid: {
      margin: 0,
      width: "100%",
      height: "100%"
    },
    imageContainer: {
      height: "100%",
      textAlign: "center",
      position: "relative"
    },
    image: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      margin: "auto",
      maxWidth: "100%",
      maxHeight: "100%",
      padding: theme.spacing.unit
    }
  };
};

function ComplexGrid(props) {
  const { classes } = props;

  return (
    <div className={classes.layout}>
      <main>
        <div className={classes.bannerContainer}>
          <Banner image={banner} />
        </div>
        <Card className={classes.reviewHeader}>
          <Grid className={classes.reviewHeaderGrid} container spacing={24}>
            <Grid className={classes.imageContainer} item xs={2}>
              <img className={classes.image} alt="poster" src={poster} />
            </Grid>
            <Grid item xs={8}>
              <Typography variant="h4">{film.title}</Typography>
              <Typography variant="body1">{film.description}</Typography>
              <Button variant="contained" className={classes.button}>
                IMDB
              </Button>
            </Grid>
            <Grid className={classes.imageContainer} item xs={2}>
              <img className={classes.image} alt="jeff3" src={jeff3} />
            </Grid>
          </Grid>
        </Card>
        <Card className={classes.reviewHeader}>
          <Grid className={classes.reviewHeaderGrid} container spacing={24}>
            <Grid item xs={4}>
              <PieChart chartWidth={200} chartHeight={200} />
            </Grid>
            <Grid item xs={4}>
              <PieChart />
            </Grid>
            <Grid item xs={4}>
              <PieChart />
            </Grid>
          </Grid>
        </Card>
        <Paper className={classes.reviewHeader}>
          <Grid className={classes.reviewHeaderGrid} container spacing={0}>
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
                    "A good adventure film. The characters and setting were done
                    well which made the story absorbing. Not my usual genre but
                    I enjoyed it."
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

ComplexGrid.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ComplexGrid);
