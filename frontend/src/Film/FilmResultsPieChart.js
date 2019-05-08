import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  ResponsiveContainer,
  PieChart,
  Pie //, Sector, Cell,
} from "recharts";

const data01 = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 }
];

const styles = theme => {
};

class FilmPieChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const { classes } = this.props;
    return (
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data01}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius="80%"
            innerRadius="50%"
            fill="#841218"
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }
}

FilmPieChart.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FilmPieChart);
