import React, { Component } from "react";
import MenuAppBar from "../../Common/MenuAppBar";
import ConfigTabs from "./ConfigTabs";

class Config extends Component {
  constructor(props) {
    super();
    this.state = {open: false}
  }

  toggleOpen = () => {
    this.setState({open: !this.state.open});
  }

  render() {
    return (
      <div>
        <MenuAppBar toggleOpen={this.toggleOpen} {...this.props} />
        <ConfigTabs toggleOpen={this.toggleOpen} open={this.state.open} {...this.props} />
      </div>
    );
  }
}

export default Config;
