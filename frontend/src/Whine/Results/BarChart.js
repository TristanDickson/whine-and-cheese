import React from "react";
import { Bar } from "react-chartjs-2";

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

function BarChart(props) {
  console.log(`Initialising Radar Chart`);
  let labels = props.metrics.map(metric => metric.name);
  let wines = props.wines;

  let fontSize = 12;
  if (window.innerWidth < 500) {
    fontSize = 8;
  } else if (window.innerWidth < 1000) {
    fontSize = 10;
  }

  let options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            suggestedMax: 10
          }
        }
      ]
    },
    legend: {
      display: false
    }
  };

  let chartData = [];

  wines.forEach(wine => {
    let wineData = wine.scores.map(score => score.averageScore);
    chartData.push({
      label: wine.name,
      data: wineData,
      fill: true,
      backgroundColor: backgroundColors[wines.indexOf(wine)],
      borderColor: borderColors[wines.indexOf(wine)],
      borderWidth: 1,
      pointBackgroundColor: borderColors[wines.indexOf(wine)],
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: borderColors[wines.indexOf(wine)]
    });
  });

  let data = { labels: labels, datasets: chartData };

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
}

export default BarChart;
