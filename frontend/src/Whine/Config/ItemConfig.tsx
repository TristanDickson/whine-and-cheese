import React, { Component } from "react";
import { WithStyles, createStyles } from "@material-ui/core";
import ConfigAppBar from "./ConfigAppBar";
import ItemConfigTabs from "./ItemConfigTabs";

const styles = createStyles({});

interface Props extends WithStyles<typeof styles> {
  history: any;
}

interface State {
  open: boolean;
}

class ItemConfig extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { open: false };
  }

  toggleOpen = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    return (
      <div key="ItemConfig">
        <ConfigAppBar
          history={this.props.history}
          open={this.state.open}
          toggleOpen={this.toggleOpen}
        />
        <ItemConfigTabs />
      </div>
    );
  }
}

export default ItemConfig;
