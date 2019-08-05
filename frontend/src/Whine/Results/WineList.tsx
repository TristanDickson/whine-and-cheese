import React from "react";
import PropTypes from "prop-types";
import {
  List,
  ListItem,
  ListItemText,
  Avatar,
  withStyles,
  createStyles
} from "@material-ui/core";
import {
  Filter1 as FilterOneIcon,
  Filter2 as FilterTwoIcon,
  Filter3 as FilterThreeIcon,
  Filter4 as FilterFourIcon,
  Filter5 as FilterFiveIcon
} from "@material-ui/icons";

const styles = (theme: any) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper
    }
  });

let getWineRankingIcon = (ranking: any) => {
  let icons = [
    <FilterOneIcon />,
    <FilterTwoIcon />,
    <FilterThreeIcon />,
    <FilterFourIcon />,
    <FilterFiveIcon />
  ];
  return icons[ranking];
};

let buildWineList = (wines: any) => {
  let wineList = [];
  for (let index = 0; index < wines.length; index++) {
    const wine = wines[index];
    wineList.push(
      <ListItem key={wines.indexOf(wine)}>
        <Avatar>{getWineRankingIcon(wines.indexOf(wine))}</Avatar>
        <ListItemText primary={wine.name} secondary={wine.label} />
      </ListItem>
    );
  }
  return wineList;
};

interface Props {
  classes: any;
  wines: any;
}

function WineList(props: Props) {
  const { classes } = props;
  return <List className={classes.root}>{buildWineList(props.wines)}</List>;
}

WineList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(WineList);
