import React from "react";
import { Typography, withStyles, createStyles } from "@material-ui/core";

const styles = (theme: any) =>
  createStyles({
    root: {
      width: "100%",
      padding: 3 * theme.spacing.unit
    }
  });

type Props = {
  classes: any;
};

function CodeNotFound(props: Props) {
  const { classes } = props;

  return (
    <Typography className={classes.root} variant="h4">
      We couldn't find that participant code.
    </Typography>
  );
}

export default withStyles(styles)(CodeNotFound);
