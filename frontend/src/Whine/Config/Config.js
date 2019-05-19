import React, { Component } from "react";
import MenuAppBar from "../../Common/MenuAppBar";
import Tabs from "./Tabs";

class Config extends Component {
  constructor(props) {
    super();
    this.state = {open: false}
  }

  toggleOpen = () => {
    console.log(this.state.open);
    this.setState({open: !this.state.open});
  }

  render() {
    return (
      <div>
        <MenuAppBar toggleOpen={this.toggleOpen} {...this.props} />
        <Tabs toggleOpen={this.toggleOpen} open={this.state.open} {...this.props} />
      </div>
    );
  }
}

export default Config;
