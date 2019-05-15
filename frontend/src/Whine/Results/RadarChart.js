import React from "react";
import { Radar } from "react-chartjs-2";

const graphColors = {
  Red: {
    fill: "rgb(220, 53, 69, 0.2)",
    border: "rgb(220, 53, 69, 1)"
  },
  Rose: {
    fill: "rgb(250, 195, 220, 0.2)",
    border: "rgb(250, 195, 220, 1)"
  },
  White: {
    fill: "rgb(240, 240, 175, 0.2)",
    border: "rgb(240, 240, 175, 1)"
  },
  Other: {
    fill: "rgb(110, 70, 200, 0.2)",
    border: "rgb(110, 70, 200, 1)"
  }
};

const backgroundColors = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(255, 206, 86, 0.2)",
  "rgba(75, 192, 192, 0.2)",
  "rgba(153, 102, 255, 0.2)",
  "rgba(255, 159, 64, 0.2)"
];

const borderColors = [
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)"
];

const data = {
  labels: [
    "Eating",
    "Drinking",
    "Sleeping",
    "Designing",
    "Coding",
    "Cycling",
    "Running"
  ],
  datasets: [
    {
      label: "My First dataset",
      backgroundColor: "rgba(179,181,198,0.2)",
      borderColor: "rgba(179,181,198,1)",
      pointBackgroundColor: "rgba(179,181,198,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(179,181,198,1)",
      data: [65, 59, 90, 81, 56, 55, 40]
    },
    {
      label: "My Second dataset",
      backgroundColor: "rgba(255,99,132,0.2)",
      borderColor: "rgba(255,99,132,1)",
      pointBackgroundColor: "rgba(255,99,132,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(255,99,132,1)",
      data: [28, 48, 40, 19, 96, 27, 100]
    }
  ]
};

function RadarChart(props) {
  let labels = props.metrics.map(metric => metric.name);

  let chartData = [];

  props.wines.forEach(wine => {
    let wineData = wine.metrics.map(metric => metric.score);
    chartData.push({
      label: wine._id.wine.name,
      data: wineData,
      backgroundColor: backgroundColors[props.wines.indexOf(wine)],
      borderColor: borderColors[props.wines.indexOf(wine)],
      borderWidth: 1
    });
  });

  return <Radar data={data} />;
}

export default RadarChart;
