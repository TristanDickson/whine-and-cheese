import React from "react";
import ReactTable from "react-table";
import { withStyles } from "@material-ui/core/styles";
import "react-table/react-table.css";

const styles = theme => ({
  right: {
    textAlign: "right"
  }
});

class ScoresTable extends React.Component {
  constructor(props) {
    super();
    this.state = { participant_id: props.participant_id };
    this.renderEditable = this.renderEditable.bind(this);
  }

  componentDidMount() {
    (async () => {
      await this.getMetrics();
      await this.getParticipantData();
    })();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.participant_id !== this.props.participant_id) {
      (async () => {
        await this.getMetrics();
        await this.getParticipantData();
      })();
    }
  }

  getMetrics = async () => {
    console.log("Getting Metrics...");
    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/metrics`
    );
    let metrics = await response.json();
    console.log(metrics);
    this.setState({ ...this.state, columns: this.buildColumns(metrics) });
  };

  getParticipantData = async () => {
    console.log("Getting Scores...");
    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/participant_data?id=${
        this.props.participant_id
      }`
    );
    let wines = await response.json();
    console.log(wines);
    this.setState({ ...this.state, data: this.buildData(wines) });
  };

  saveScore = (id, value) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/scores`, {
      method: "put",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        _id: id,
        value: value
      })
    }).then(res => {
      if (res.ok) return res.json();
    });
  };

  buildColumns = metrics => {
    const { classes } = this.props;
    let columns = [
      {
        Header: "Wine",
        accessor: "wineName"
      }
    ];
    metrics.forEach(metric => {
      columns.push({
        id: metric.name,
        Header: metric.name,
        className: classes.right,
        Cell: this.renderEditable
      });
    });
    return columns;
  };

  buildData = wines => {
    let data = [];
    wines.forEach(wine => {
      let row = {
        wineId: wine.wine._id,
        wineName: wine.wine.name
      };
      wine.scores.forEach(score => {
        row[score.metric.name] = {
          id: score._id,
          value: score.value
        };
      });
      data.push(row);
    });
    return data;
  };

  renderEditable(cellInfo) {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.data];
          data[cellInfo.index][cellInfo.column.id].value = e.target.innerHTML;
          this.saveScore(
            data[cellInfo.index][cellInfo.column.id].id,
            Number(data[cellInfo.index][cellInfo.column.id].value)
          );
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.data[cellInfo.index][cellInfo.column.id].value
        }}
      />
    );
  }

  render() {
    return (
      <div>
        {this.state.columns && this.state.data && (
          <div>
            <ReactTable
              data={this.state.data}
              columns={this.state.columns}
              defaultPageSize={10}
              minRows={0}
              className="-striped -highlight"
            />
            <br />
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(ScoresTable);
