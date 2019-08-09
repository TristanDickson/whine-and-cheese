import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Grid, withStyles, createStyles, Theme } from "@material-ui/core";
import Banner from "../../Common/Banner";
import RateStepper from "./RateStepper";
import banner from "./banner-light.png";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      padding: theme.spacing.unit
    }
  });

interface Props {
  classes: any;
  location: any;
}

interface State {
  loading: boolean;
  redirect: boolean;
  set_participant: any;
}

class Rate extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
      redirect: false,
      set_participant: null
    };
  }

  componentDidMount() {
    let code = this.props.location.search.slice(1);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/checkCode?code=${code}`)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        } else {
          return response.json();
        }
      })
      .then(set_participant => {
        this.setState({ loading: false, set_participant: set_participant });
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
            {this.state.set_participant ? (
              <RateStepper set_participant={this.state.set_participant} />
            ) : null}
          </Grid>
          <Grid item xs={false} md={1} />
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Rate);
