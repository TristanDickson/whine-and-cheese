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

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
});

let getWineRankingIcon = ranking => {
  let icons = [<FilterOneIcon />, <FilterTwoIcon />, <FilterThreeIcon />, <FilterFourIcon />];
  return icons[ranking];
};

let buildWineList = wines => {
  let wineList = [];
  wines.forEach(wine => {
    console.log(wine._id.wine);
    wineList.push(
      <ListItem key={wines.indexOf(wine)}>
        <Avatar>
          {getWineRankingIcon(wines.indexOf(wine))}
        </Avatar>
        <ListItemText
          primary={wine._id.wine.name}
          secondary={wine._id.wine.label}
        />
      </ListItem>
    );
  });
  return wineList;
};

function WineList(props) {
  const { classes } = props;
  console.log(props.wines);
  return (
    <List className={classes.root}>
      {buildWineList(props.wines)}
    </List>
  );
}

WineList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(WineList);
