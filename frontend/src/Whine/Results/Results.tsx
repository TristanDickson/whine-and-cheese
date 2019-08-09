import React, { Component } from "react";

import { connect } from "react-redux";

import AppBar from "../Config/ConfigAppBar";
import ResultsBody from "./ResultsBody";
import SetSelect from "./SetSelect";

interface Props {
  history: any;
  sets: any;
}

interface State {
  open: boolean;
  selectedSet: any;
}

class Results extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { open: false, selectedSet: 0 };
  }

  toggleOpen = () => {
    this.setState({ open: !this.state.open });
  };

  changeSet = (event: any) => {
    this.setState({ selectedSet: event.target.value });
  };

  render() {
    let sets = this.props.sets.sets;
    let { open, selectedSet } = this.state;

    return (
      <div>
        <AppBar
          history={this.props.history}
          open={open}
          toggleOpen={this.toggleOpen}
        />
        <SetSelect
          sets={sets}
          selectedSet={selectedSet}
          changeSet={this.changeSet}
        />
        {sets.length > 0 && <ResultsBody set={sets[selectedSet]} />}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  const { sets } = state;
  return { sets };
};

export default connect(mapStateToProps)(Results);
