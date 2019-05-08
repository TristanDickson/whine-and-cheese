import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  root: {
    width: "100%",
    padding: 3*theme.spacing.unit
  }
});

function CodeNotFound(props) {
  const {classes} = props;

  return <Typography className={classes.root} variant="h4">We couldn't find that participant code.</Typography>;
}


export default withStyles(styles)(CodeNotFound);