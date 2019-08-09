import React from "react";
import { Bar } from "react-chartjs-2";

/*const graphColors = {
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
};*/

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

interface Props {
  sets_subjects: any;
  questions: any;
}

function BarChart(props: Props) {
  console.log(`Initialising Bar Chart`);
  let labels = props.questions.map((question: any) => question.name);
  let sets_subjects = props.sets_subjects;

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

  let chartData: any = [];

  sets_subjects.forEach((set_subject: any) => {
    let subjectData = set_subject.answers.map(
      (answer: any) => answer.averageAnswer
    );
    chartData.push({
      label: set_subject.subject.name,
      data: subjectData,
      fill: true,
      backgroundColor: backgroundColors[sets_subjects.indexOf(set_subject)],
      borderColor: borderColors[sets_subjects.indexOf(set_subject)],
      borderWidth: 1,
      pointBackgroundColor: borderColors[sets_subjects.indexOf(set_subject)],
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: borderColors[sets_subjects.indexOf(set_subject)]
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
