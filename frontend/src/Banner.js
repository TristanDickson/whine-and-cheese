import React from "react";
import { withStyles } from '@material-ui/core/styles';
import banner from "./banner-light.png";

const styles = theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  banner: {
    width: "80%",
    paddingLeft:"10%",
    marginTop: 3*theme.spacing.unit,
    marginBottom: theme.spacing.unit
  }
});

function Banner(props) {
  const {classes} = props;

  return (
    <div className={classes.root}>
      <img className={classes.banner} src={banner} alt="Banner" />
    </div>
  );
}

export default withStyles(styles)(Banner);
