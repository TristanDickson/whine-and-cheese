import React from "react";
import ReactTable from "react-table";
import { withStyles } from "@material-ui/core/styles";
import 'react-table/react-table.css';

const styles = theme => ({
  right: {
    textAlign: "right"
  }
});

class ScoresTable extends React.Component {
  constructor(props) {
    super();
    this.state = {participant_id: props.participant_id}
    this.renderEditable = this.renderEditable.bind(this);
  }

  componentDidMount() {
    (async () => {
      await this.getMetrics();
      await this.getScores(this.props.participant_id);
    })();
  }  

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.participant_id !== this.props.participant_id) {
      (async () => {
        await this.getMetrics();
        await this.getScores(this.props.participant_id);
      })();
    }
  }

  getMetrics = async () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/metrics`)
      .then(response => {
        return response.json();
      })
      .then(metrics => {
        this.setState({ ...this.state, metrics: [...metrics] });
      });
  };

  getScores = async () => {
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}/participant_scores?id=${this.props.participant_id}`
    )
      .then(response => {
        return response.json();
      })
      .then(wines => {
        let data = [];
        wines.forEach(wine => {
          let row = {
            wineId: wine._id.wine._id,
            wineName: wine._id.wine.name
          };
          wine.scores.forEach(score => {
            row[score.metric.name] = {
              id: score.id,
              value: score.value
            };
          });
          data.push(row);
        });
        //console.log(data);
        this.setState({ ...this.state, scores: [...data] });
      });
  };

  saveScore = (id, value) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/scores`, {
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

  buildColumns = () => {
    const { classes } = this.props;
    let columns = [
      {
        Header: "Wine",
        accessor: "wineName"
      }
    ];
    this.state.metrics.forEach(metric => {
      columns.push({
        id: metric.name,
        Header: metric.name,
        className: classes.right,
        Cell: this.renderEditable
      });
    });
    return columns;
  };

  renderEditable(cellInfo) {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.scores];
          data[cellInfo.index][cellInfo.column.id].value = e.target.innerHTML;
          this.saveScore(
            data[cellInfo.index][cellInfo.column.id].id,
            Number(data[cellInfo.index][cellInfo.column.id].value)
          );
          //this.setState();
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.scores[cellInfo.index][cellInfo.column.id].value
        }}
      />
    );
  }

  render() {
    return (
      <div>
        {this.state.metrics && (
          <div>
            <ReactTable
              data={this.state.scores}
              columns={this.buildColumns()}
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
