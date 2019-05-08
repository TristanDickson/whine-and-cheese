import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Banner from "../../Banner";
import RateStepper from "./RateStepper";
import Grid from "@material-ui/core/Grid";
import { Redirect } from "react-router-dom";
import banner from "./banner-light.png";

const styles = theme => ({
  root: {
    width: "100%",
    padding: theme.spacing.unit
  }
});

class Rate extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      redirect: false
    };
  }

  componentDidMount() {
    let code = this.props.location.search.slice(1);
    fetch(`http://localhost:5000/api/checkCode?code=${code}`)
      .then(response => {
        console.log(response);
        if (!response.ok) {
          throw Error(response.statusText);
        } else {
          return response.json();
        }
      })
      .then(participant => {
        this.setState({ loading: false, participant_id: participant._id });
      })
      .catch(error => {
        console.log(error);
        this.setState({ loading: false, redirect: true });
      });
  }

  render() {
    const { loading, redirect } = this.state;
    const { classes } = this.props;

    if (loading) {
      return null;
    }
    if (redirect) {
      return <Redirect to="/codeNotFound" />;
    }
    return (
      <div>
        <Grid
          container
          spacing={0}
          alignItems="center"
          className={classes.root}
        >
          <Grid item xs={false} md={1} />
          <Grid item xs={12} md={10}>
            <Banner image={banner} />
            <RateStepper participant_id={this.state.participant_id} />
          </Grid>
          <Grid item xs={false} md={1} />
        </Grid>
      </div>
    );
  }
}

Rate.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Rate);
