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

let getSubjectRankingIcon = (ranking: any) => {
  let icons = [
    <FilterOneIcon />,
    <FilterTwoIcon />,
    <FilterThreeIcon />,
    <FilterFourIcon />,
    <FilterFiveIcon />
  ];
  return icons[ranking];
};

let buildSubjectList = (subjects: any) => {
  let subjectList = [];
  for (let index = 0; index < subjects.length; index++) {
    const subject = subjects[index];
    subjectList.push(
      <ListItem key={subjects.indexOf(subject)}>
        <Avatar>{getSubjectRankingIcon(subjects.indexOf(subject))}</Avatar>
        <ListItemText primary={subject.name} secondary={subject.label} />
      </ListItem>
    );
  }
  return subjectList;
};

interface Props {
  classes: any;
  subjects: any;
}

function SubjectList(props: Props) {
  const { classes } = props;
  return <List className={classes.root}>{buildSubjectList(props.subjects)}</List>;
}

SubjectList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SubjectList);
