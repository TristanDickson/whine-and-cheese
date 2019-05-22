import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import FilterOneIcon from "@material-ui/icons/Filter1";
import FilterTwoIcon from "@material-ui/icons/Filter2";
import FilterThreeIcon from "@material-ui/icons/Filter3";
import FilterFourIcon from "@material-ui/icons/Filter4";
import FilterFiveIcon from "@material-ui/icons/Filter5";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
});

let getWineRankingIcon = ranking => {
  let icons = [
    <FilterOneIcon />,
    <FilterTwoIcon />,
    <FilterThreeIcon />,
    <FilterFourIcon />,
    <FilterFiveIcon />
  ];
  return icons[ranking];
};

let buildWineList = wines => {
  let wineList = [];
  for (let index = 0; index < wines.length; index++) {
    const wine = wines[index];
    wineList.push(
      <ListItem key={wines.indexOf(wine)}>
        <Avatar>{getWineRankingIcon(wines.indexOf(wine))}</Avatar>
        <ListItemText
          primary={wine.name}
          secondary={wine.label}
        />
      </ListItem>
    );
  }
  return wineList;
};

function WineList(props) {
  const { classes } = props;
  return <List className={classes.root}>{buildWineList(props.wines)}</List>;
}

WineList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(WineList);
