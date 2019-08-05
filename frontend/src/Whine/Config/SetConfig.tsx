import React, { Component } from "react";
import ConfigAppBar from "./ConfigAppBar";
import SetConfigTabs from "./SetConfigTabs";
import { WithStyles, createStyles } from "@material-ui/core";

const styles = createStyles({});

interface Props extends WithStyles<typeof styles> {
  history: any;
}

interface State {
  open: boolean;
}

class SetConfig extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { open: false };
  }

  toggleOpen = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    return (
      <div>
        <ConfigAppBar
          history={this.props.history}
          open={this.state.open}
          toggleOpen={this.toggleOpen}
        />
        <SetConfigTabs />
      </div>
    );
  }
}

export default SetConfig;
