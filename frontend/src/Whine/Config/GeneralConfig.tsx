import React, { Component } from "react";
import { WithStyles, createStyles } from "@material-ui/core";
import ConfigAppBar from "./ConfigAppBar";

const styles = createStyles({});

interface Props extends WithStyles<typeof styles> {
  history: any;
}

interface State {
  open: boolean;
}

class GeneralConfig extends Component<Props, State> {
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
      </div>
    );
  }
}

export default GeneralConfig;
