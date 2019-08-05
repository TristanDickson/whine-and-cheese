import React, { Component } from "react";
import AppBar from "../Config/ConfigAppBar";
import Body from "./Body";

interface Props {
  history: any;
}

interface State {
  open : boolean;
}

class Results extends Component<Props, State> {
  constructor(props:Props) {
    super(props);    
    this.state = {open: false}
  }

  toggleOpen = () => {
    this.setState({open: !this.state.open});
  }

  render() {
    return (
      <div>
        <AppBar history={this.props.history} open={this.state.open} toggleOpen={this.toggleOpen}/>
        <Body />
      </div>
    );
  }
}

export default Results;
