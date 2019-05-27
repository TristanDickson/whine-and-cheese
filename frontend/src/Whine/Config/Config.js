import React, { Component } from "react";
import ConfigAppBar from "./AppBar";
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
    console.log(this.props);
    return (
      <div>
        <ConfigAppBar history={this.props.history} open={this.state.open} toggleOpen={this.toggleOpen}/>
        <ConfigTabs />
      </div>
    );
  }
}

export default Config;
