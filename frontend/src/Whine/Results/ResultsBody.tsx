import React, { Component } from "react";
import {
  Grid,
  Paper,
  Card,
  CardHeader,
  CardContent,
  Typography,
  withStyles,
  createStyles
} from "@material-ui/core";
import SubjectList from "./SubjectList";
import RadarChart from "./RadarChart";
import BarChart from "./BarChart";

const styles = (theme: any) =>
  createStyles({
    layout: {
      width: "auto",
      [theme.breakpoints.up(1200 + theme.spacing.unit * 3 * 2)]: {
        width: 1200,
        marginLeft: "auto",
        marginRight: "auto"
      }
    },
    button: {
      margin: theme.spacing.unit,
      backgroundColor: "#ffc107"
    },
    reviewHeaderGrid: {
      margin: 0,
      width: "100%",
      height: "100%"
    },
    cardHeader: {
      textAlign: "center"
    },
    chart: {
      padding: "5px"
    },
    subjectList: {
      paddingTop: 0
    },
    author: {
      fontStyle: "italic"
    }
  });

interface Props {
  classes: any;
  set: any;
}

interface State {
  questions: any;
  subjectAvgScores: any;
  subjectData: any;
}

class ResultsBody extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { questions: [], subjectAvgScores: [], subjectData: [] };
  }

  async componentDidMount() {
    let [questions, subjectAvgScores, subjectData] = await Promise.all([
      this.getQuestions(),
      this.getSubjectAvgScores(),
      this.getSubjectData()
    ]);
    this.setState({
      questions: questions,
      subjectAvgScores: subjectAvgScores,
      subjectData: subjectData
    });
  }

  async componentDidUpdate(prevProps: Props) {
    if (prevProps !== this.props) {
      let [questions, subjectAvgScores, subjectData] = await Promise.all([
        this.getQuestions(),
        this.getSubjectAvgScores(),
        this.getSubjectData()
      ]);
      this.setState({
        questions: questions,
        subjectAvgScores: subjectAvgScores,
        subjectData: subjectData
      });
    }
  }

  getQuestions = async () => {
    console.log(`Getting questions`);
    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/questions`
    );
    let questions = await response.json();
    questions = questions.filter((question: any) => question.type === "Slider");
    return questions;
  };

  getSubjectAvgScores = async () => {
    console.log(`Getting subject average scores`);
    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/subject_average_scores`
    );
    let scores = await response.json();
    return scores;
  };

  getSubjectData = async () => {
    console.log(`Getting subject data`);
    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/set_data?set_id=${
        this.props.set._id
      }`
    );
    let data = await response.json();
    return data;
  };

  getRandomComment = (classes: any, comments: any) => {
    let filledComments = comments.filter(
      (comment: any) => comment.comment !== ""
    );
    if (filledComments.length > 0) {
      let selectedComment =
        filledComments[Math.floor(Math.random() * filledComments.length)];
      return (
        <div>
          <Typography inline>{`"${selectedComment.comment}" - `}</Typography>
          <Typography inline className={classes.author}>
            {`${selectedComment.participant.firstName} ${
              selectedComment.participant.lastName
            }`}
          </Typography>
        </div>
      );
    } else {
      return (
        <div>
          <Typography>No comments made</Typography>
        </div>
      );
    }
  };

  render() {
    const { classes } = this.props;
    let questions = this.state.questions;
    let sets_subjects = this.state.subjectData;
    let subjectAvgScores = this.state.subjectAvgScores;

    return (
      <div className={classes.layout}>
        <Paper className={classes.reviewHeader}>
          <Grid className={classes.reviewHeaderGrid} container spacing={24}>
            <Grid item md={4} xs={12}>
              <Card className={classes.card}>
                <CardHeader
                  className={classes.cardHeader}
                  title="Subject Ranking"
                />
                <CardContent className={classes.subjectList}>
                  {subjectAvgScores && (
                    <SubjectList subjects={subjectAvgScores} />
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={8} xs={12}>
              <Card className={classes.card}>
                <CardHeader
                  className={classes.cardHeader}
                  title="Average Subject Scores"
                />
                <CardContent className={classes.chart}>
                  <RadarChart
                    sets_subjects={sets_subjects}
                    questions={questions}
                  />
                </CardContent>
              </Card>
            </Grid>
            {sets_subjects.map((set_subject: any) => (
              <Grid key={set_subject._id} item md={4} xs={12}>
                <Card className={classes.card}>
                  <CardHeader
                    className={classes.cardHeader}
                    title={set_subject.subject.name}
                  />
                  <CardContent className={classes.chart}>
                    <BarChart
                      questions={questions}
                      sets_subjects={sets_subjects.slice(
                        [sets_subjects.indexOf(set_subject)],
                        sets_subjects.indexOf(set_subject) + 1
                      )}
                    />
                  </CardContent>
                  <CardContent>
                    {this.getRandomComment(classes, [
                      {
                        comment: "alpha",
                        participant: { firstName: "Ben", lastName: "South" }
                      },
                      {
                        comment: "beta",
                        participant: { firstName: "Jerry", lastName: "West" }
                      },
                      {
                        comment: "omega",
                        participant: { firstName: "Tom", lastName: "North" }
                      }
                    ])}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(ResultsBody);
