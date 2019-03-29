Chart.defaults.global.defaultFontColor = "white";

const config = {
  sheet_id: "1e89oUmDxoLP-FeAWB7n5u2nzlqkWMXumtMQ31okNYmY",
  api_key: "AIzaSyCOgxxT26QGMJxL6AlsLGpdXG-XApem5yM",
  max_wines: 6,
  max_attendees: 12,
  num_wines: 6
};

const makeSheetUrl = (config, tab_name) => {
  return `https://sheets.googleapis.com/v4/spreadsheets/${
    config.sheet_id
  }/values/${tab_name}?key=${config.api_key}`;
};

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
  "rgba(255,99,132,1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)"
];

addAttendee = (active, attendee, elementID) => {
  $("#" + elementID).append(
    '<li><a class="dropdown-item" href="index.html?user=' +
      attendee.name +
      '">' +
      attendee.name +
      "</a></li>"
  );
};

addWine = (active, wine, elementID) => {
  $("#" + elementID).append(
    '<li><a class="dropdown-item" href="index.html?wine=' +
      wine.name +
      '">' +
      wine.name +
      "</a></li>"
  );
};

addWineRanking = (index, wine, elementID) => {
  let suffix = "";
  switch (true) {
    case index == 1:
      suffix = "st";
      break;
    case index == 2:
      suffix = "nd";
      break;
    case index == 3:
      suffix = "rd";
      break;
    default:
      suffix = "th";
      break;
  }

  $("#" + elementID).append(
    `<li class="list-group-item bg-dark text-light">${index}${suffix} - ${
      wine.name
    } - (Wine ${wine.number})</li>`
  );
};

getWines = async graphColors => {
  let wineList = [];
  return new Promise(resolve => {
    $.ajax({
      url: makeSheetUrl(config, "WineList"),
      success: result => {
        wineList.wines = [];

        for (let i = 1; i < config.max_wines + 1; i++) {
          wineList.wines.push({
            number: i,
            label: result.values[i][0],
            brought: result.values[i][1],
            name: result.values[i][2],
            type: result.values[i][3],
            responsible: result.values[i][4]
          });
        }

        wineList.wines.forEach(wine => {
          wine["styles"] = {
            fillColor: graphColors[wine.type].fill,
            borderColor: graphColors[wine.type].border
          };
        });
        resolve(wineList);
      }
    });
  });
};

appendAverageScores = async wineList => {
  return new Promise(resolve => {
    $.ajax({
      url: makeSheetUrl(config, "Completeness"),
      success: result => {
        for (let i = 1; i < config.max_wines + 1; i++) {
          wineList.wines[i - 1]["ratingComplete"] =
            result.values[i][3] == 1 ? true : false;
          wineList.wines[i - 1]["avgVals"] = [
            Math.round(result.values[i][4] * 100) / 100,
            Math.round(result.values[i][5] * 100) / 100,
            Math.round(result.values[i][6] * 100) / 100,
            Math.round(result.values[i][7] * 100) / 100,
            Math.round(result.values[i][8] * 100) / 100
          ];
          wineList.wines[i - 1]["totalScore"] =
            wineList.wines[i - 1].avgVals.reduce((total, val) => {
              return total + val;
            }) / wineList.wines[i - 1].avgVals.length;
        }

        resolve();
      }
    });
  });
};

getAttendees = async () => {
  let attendees = [];
  return new Promise(resolve => {
    $.ajax({
      url: makeSheetUrl(config, "AttendeeList"),
      success: result => {
        for (let i = 1; i < config.max_attendees + 1; i++) {
          attendees.push({
            attending: result.values[i][1] == "YES" ? true : false,
            name: result.values[i][2]
          });
        }
        resolve(attendees);
      }
    });
  });
};

appendPersonalScores = async wineList => {
  return new Promise(resolve => {
    $.ajax({
      url: makeSheetUrl(config, "ResponseSummary"),
      success: result => {
        wineList.measures = result.values[0].splice(1, 5);

        for (let j = 0; j < config.max_wines; j++) {
          wineList.wines[j]["persVals"] = [];

          for (let i = 1; i < config.max_attendees + 1; i++) {
            let attendee = result.values[i][31];

            if (attendee != "nobody") {
              wineList.wines[j]["persVals"][attendee] = {
                scores: [
                  result.values[i][5 * j + 1],
                  result.values[i][5 * j + 2],
                  result.values[i][5 * j + 3],
                  result.values[i][5 * j + 4],
                  result.values[i][5 * j + 5]
                ]
              };
            }
          }
        }

        resolve();
      }
    });
  });
};

appendComments = async wineList => {
  return new Promise(resolve => {
    $.ajax({
      url: makeSheetUrl(config, "WineComments"),
      success: result => {
        for (let j = 1; j < config.max_attendees + 1; j++) {
          let attendee = result.values[7][j];

          if (attendee != "nobody") {
            for (let i = 0; i < config.max_wines; i++) {
              wineList.wines[i]["persVals"][attendee].comment =
                result.values[i + 1][j];
            }
          }
        }

        resolve();
      }
    });
  });
};

drawRadarChart = (wineList, elementID, fontSize, attendee = null) => {
  let wineHTML = "";
  wineHTML += '<div class="card mb-4 shadow bg-dark">';
  wineHTML += '<div class="card-body">';
  wineHTML +=
    '<h5 class="card-title text-white">' +
    (attendee ? attendee : "Average Wine") +
    " Scores</h5>";
  wineHTML += '<canvas id="wine-radar-chart"></canvas>';
  wineHTML += "</div>";
  wineHTML += "</div>";
  $("#" + elementID).html(wineHTML);

  let chartData = [];

  wineList.wines.forEach(wine => {
    if (wine.ratingComplete) {
      chartData.push({
        label: wine.name,
        data: attendee ? wine.persVals[attendee].scores : wine.avgVals,
        backgroundColor: backgroundColors[wine.number - 1],
        borderColor: borderColors[wine.number - 1],
        borderWidth: 1
      });
    }
  });

  new Chart(document.getElementById("wine-radar-chart"), {
    type: "radar",
    data: {
      labels: wineList.measures,
      datasets: chartData
    },
    options: {
      scale: {
        ticks: {
          suggestedMin: 0,
          suggestedMax: 10,
          showLabelBackdrop: false
        }
      },
      elements: {
        line: {
          tension: 0,
          borderWidth: 2
        }
      },
      legend: {
        labels: {
          fontSize: fontSize
        }
      }
    },
    layout: {
      padding: {
        top: 20
      }
    },
    plugins: {
      deferred: {
        yOffset: "50%",
        delay: 250
      }
    }
  });
};

drawWineRadarChart = (wineList, elementID, fontSize, wine) => {
  let wineHTML = "";
  wineHTML += '<div class="card mb-4 shadow bg-dark">';
  wineHTML += '<div class="card-body">';
  wineHTML +=
    '<h5 class="card-title text-white">' +
    wine.name +
    ' Scores</h5> - <i class="text-light">Brought by: ' +
    wine.responsible +
    "</i>";
  wineHTML += '<canvas id="wine-radar-chart"></canvas>';
  wineHTML += "</div>";
  wineHTML += "</div>";
  $("#" + elementID).html(wineHTML);

  let chartData = [];

  Object.keys(wine.persVals).forEach((attendee, index) => {
    if (wine.ratingComplete) {
      chartData.push({
        label: attendee,
        data: wine.persVals[attendee].scores,
        backgroundColor: backgroundColors[index % 6],
        borderColor: borderColors[index % 6],
        borderWidth: 1
      });
    }
  });

  new Chart(document.getElementById("wine-radar-chart"), {
    type: "radar",
    data: {
      labels: wineList.measures,
      datasets: chartData
    },
    options: {
      scale: {
        ticks: {
          suggestedMin: 0,
          suggestedMax: 10,
          showLabelBackdrop: false
        }
      },
      elements: {
        line: {
          tension: 0,
          borderWidth: 2
        }
      },
      legend: {
        labels: {
          fontSize: fontSize
        }
      }
    },
    layout: {
      padding: {
        top: 20
      }
    },
    plugins: {
      deferred: {
        yOffset: "50%",
        delay: 250
      }
    }
  });
};

drawBarChart = (measures, wine, elementID, attendee = null) => {
  let comment = "";

  if (attendee) {
    comment = `\"${wine.persVals[attendee].comment}\" - <i>${attendee}</i>`;
  } else {
    let attendeesComments = Object.keys(wine.persVals).filter(attendee => {
      return wine.persVals[attendee].comment;
    });
    console.log(attendeesComments);
    let commenter =
      attendeesComments[
        Math.floor(Math.random() * Object.keys(attendeesComments).length)
      ];

    comment = `\"${wine.persVals[commenter].comment}\" - <i>${commenter}</i>`;
  }

  $("#" + elementID).append('<div id="wine-bar-' + wine.number + '"></div>');
  let wineHTML = "";
  wineHTML += '<div class="card mb-4 shadow bg-dark">';
  wineHTML += '<div class="card-body">';
  wineHTML += '<h5 class="card-title text-white">' + wine.name + "</h5>";
  wineHTML += '<canvas id="wine-bar-chart-' + wine.number + '"></canvas>';
  wineHTML += "</div>";
  wineHTML += `<div class="card-footer text-light">${comment}</div>`;
  wineHTML += "</div>";
  $("#wine-bar-" + wine.number).html(wineHTML);

  new Chart(document.getElementById("wine-bar-chart-" + wine.number), {
    type: "bar",
    data: {
      labels: measures,
      datasets: [
        {
          label: wine.attendee,
          data: attendee ? wine.persVals[attendee].scores : wine.avgVals,
          fill: true,
          backgroundColor: wine.styles.fillColor,
          borderColor: wine.styles.borderColor,
          pointBackgroundColor: wine.styles.fillColor,
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: wine.styles.fillColor
        }
      ]
    },
    options: {
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
    },
    layout: {
      padding: {
        top: 20
      }
    },
    plugins: {
      deferred: {
        yOffset: "50%",
        delay: 250
      }
    }
  });
};

drawMeasureBarChart = (measureIndex, measure, wine, elementID) => {
  $("#" + elementID).append('<div id="wine-bar-' + measure + '"></div>');
  let wineHTML = "";
  wineHTML += '<div class="card mb-4 shadow bg-dark">';
  wineHTML += '<div class="card-body">';
  wineHTML += '<h5 class="card-title text-white">' + measure + "</h5>";
  wineHTML += '<canvas id="wine-bar-chart-' + measure + '"></canvas>';
  wineHTML += "</div>";
  wineHTML += "</div>";
  $("#wine-bar-" + measure).html(wineHTML);

  chartData = [];
  backgroundColor = [];
  borderColor = [];

  Object.values(wine.persVals).forEach((attendee, index) => {
    chartData.push(attendee.scores[measureIndex]);
    backgroundColor.push(backgroundColors[index % backgroundColors.length]);
    borderColor.push(borderColors[index % borderColors.length]);
  });

  new Chart(document.getElementById("wine-bar-chart-" + measure), {
    type: "bar",
    data: {
      labels: Object.keys(wine.persVals),
      datasets: [
        {
          label: wine.name,
          data: chartData,
          fill: true,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1
        }
      ]
    },
    options: {
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
    },
    layout: {
      padding: {
        top: 20
      }
    },
    plugins: {
      deferred: {
        yOffset: "50%",
        delay: 250
      }
    }
  });
};

$(document).ready(function() {
  let searchParams = new URLSearchParams(window.location.search);

  let responsiveFontSize = 12;
  if (window.innerWidth < 500) {
    responsiveFontSize = 8;
  } else if (window.innerWidth < 1000) {
    responsiveFontSize = 10;
  }
  let selectedAttendee = searchParams.get("user");
  let selectedWine = searchParams.get("wine");

  (async () => {
    let attendees = await getAttendees();
    let wineList = await getWines(graphColors);

    await appendAverageScores(wineList);
    await appendPersonalScores(wineList);
    await appendComments(wineList);
    console.log(attendees);
    console.log(wineList);

    if (selectedAttendee) {
      $("#primary-chart-row").append(
        '<div id="the-wines" class="col-md-12"></div>'
      );
      drawRadarChart(
        wineList,
        "the-wines",
        responsiveFontSize,
        selectedAttendee
      );

      wineList.wines.forEach(wine => {
        if (wine.ratingComplete) {
          drawBarChart(wineList.measures, wine, "the-bars", selectedAttendee);
        }
      });
    } else if (selectedWine) {
      $("#primary-chart-row").append(
        '<div id="the-wines" class="col-md-12"></div>'
      );
      let selectedWineObject = wineList.wines.find(wine => {
        return wine.name == selectedWine;
      });
      drawWineRadarChart(
        wineList,
        "the-wines",
        responsiveFontSize,
        selectedWineObject
      );

      wineList.measures.forEach((measure, index) => {
        drawMeasureBarChart(index, measure, selectedWineObject, "the-bars");
      });
    } else {
      $("#primary-chart-row").append(
        '<div id="the-wines" class="col-md-8"></div>'
      );
      let wineRankingHTML = "";
      wineRankingHTML += '<div id="wine-rankings-card" class="col-md-4">';
      wineRankingHTML += '<div class="card mb-4 shadow bg-dark">';
      wineRankingHTML += '<div class="card-body">';
      wineRankingHTML += '<h5 class="card-title text-white">Wine Rankings</h5>';
      wineRankingHTML += '<ul id=wine-rankings class="list-group"></ul>';
      wineRankingHTML += "</div>";
      wineRankingHTML += "</div>";
      wineRankingHTML += "</div>";
      $("#primary-chart-row").append(wineRankingHTML);

      drawRadarChart(wineList, "the-wines", responsiveFontSize);

      wineList.wines.forEach(wine => {
        if (wine.ratingComplete) {
          drawBarChart(wineList.measures, wine, "the-bars");
        }
      });

      let completedWines = wineList.wines.filter(wine => {
        return wine.ratingComplete;
      });
      console.log(completedWines);
      let rankedWines = completedWines.sort((wine1, wine2) => {
        return wine2.totalScore - wine1.totalScore;
      });
      console.log(rankedWines);
      rankedWines.forEach((wine, index) => {
        if (wine.ratingComplete) {
          addWineRanking(index + 1, wine, "wine-rankings");
        }
      });
    }

    attendees.forEach(attendee => {
      if (attendee.attending) {
        addAttendee(
          attendee == selectedAttendee,
          attendee,
          "attendees-dropdown"
        );
      }
    });
    wineList.wines.forEach(wine => {
      if (wine.ratingComplete) {
        addWine(wine == selectedWine, wine, "wines-dropdown");
      }
    });
  })();
});
