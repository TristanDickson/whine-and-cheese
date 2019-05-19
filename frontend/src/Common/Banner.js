import React from "react";
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    width: "100%",
    height: "100%",
    textAlign: "center",    
    position: "relative"
  },
  banner: {    
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
});

function Banner(props) {
  const {classes} = props;

  return (
    <div className={classes.root}>
      <img className={classes.banner} src={props.image} alt="Banner" />
    </div>
  );
}

export default withStyles(styles)(Banner);
