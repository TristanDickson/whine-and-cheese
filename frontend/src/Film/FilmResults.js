import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles
} from "@material-ui/core/styles";
import AppBar from "./FilmResultsAppBar";
import Body from "./FilmResultsBody";
import Background from "./cinema-background.jpg";

//Core
/*var film = [
  "True Grit",
  "truegrit",
  "tt1403865",
  "A stubborn teenager enlists the help of a tough U.S. Marshal to track down her father's murderer."
];
var jeffPts = 3;
var conceptPts = 76;
var cinemaPts = 72;
var performPts = 88;
var reccPts = 90;

//Additional
var img1a = ["little blackie", "60% of reviewers", "little-blackie"];
var img1b = ["mr bear", "30% of reviewers", "mr-bear"];
var img1c = ["jeff", "20% of reviewers", "jeff"];
var img1d = ["matt damon", "20% of reviewers", "matt-damon"];
var img1e = ["wednesday adams", "20% of reviewers", "wednesday-adams"];
var img1f = ["snake", "10% of reviewers", "snake"];

var comment = [
  "fuggin love a coen bro film. Outstanding dialogue, enthralling performances, can't really fault it.<br><br>Lil blackie really did not need 2 die tho. Why jeff, why?",
  "The lead girl (Hailee Steinfeld) seems to now have some kind of music career which is p weird to watch",
  "3 Jeff's for Jeff, he was cracking. I enjoyed pretty much lots of this film. I expect it was much more well received critically than Roma, given that something actually happens. Bon.<br><br>Poor Blackie sad face.",
  "Irrational amount of death and suffering to avenge one murder.",
  "I am definitely a fan of the Coens' work. Excellent cinematography, and a plot highlighting 'True Grit' throughout.",
  "A good adventure film. The characters and setting were done well which made the story absorbing. Not my usual genre but I enjoyed it.",
  "It's good! The Coen brothers do it again. The bit with the snake at the end is genuinely creepy as fuck. It's four Jeffs from me, Jeff"
];

var featuredComment = [2, 5];
*/

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    type: "dark",
    primary: {
      main: "#343a40"
    },
    secondary: {
      main: "#841218"
    },
    background: { paper: "#343a40" }
  }
});

const styles = theme => ({
  root: {
    backgroundImage: `url(${Background})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center"
  }
});

class FilmResults extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <AppBar />
          <Body />
        </div>
      </MuiThemeProvider>
    );
  }
}

FilmResults.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FilmResults);
