var daysOfWeek = new Array(7);
  daysOfWeek[0] = "Sunday";
  daysOfWeek[1] = "Monday";
  daysOfWeek[2] = "Tuesday";
  daysOfWeek[3] = "Wednesday";
  daysOfWeek[4] = "Thursday";
  daysOfWeek[5] = "Friday";
  daysOfWeek[6] = "Saturday";

var dailyLabel = new Array(7);
var dailyTemp = new Array(7);
var yAxesLabel = "Temperature (°F)"
var chartTitle = "Daily Forecast"

function setDailyLabel () {
  for (i = 0; i < dailyLabel.length; i++) {
    dayInfo = new Date (jsonData['daily'][(i+1).toString()]['dt'] * 1000)
    dailyLabel[i] = [dayInfo.toLocaleDateString('en-US', {weekday: 'long'}),dayInfo.toLocaleDateString('en-US')]
  }
}

function setTitle (unit) {

}

function setyAxesLabel(unit) {
  if (unit=="F") {
    yAxesLabel = "Temperature (°F)"
  } else if (unit=="C") {
    yAxesLabel = "Temperature (°C)"
  }
  chart.options.scales.yAxes['0'].scaleLabel.labelString = yAxesLabel;
  chart.update();
}

function setDailyTemp (unit="F") {
  if (unit=="F") {
    for (i = 0; i < dailyTemp.length; i++) {
      dailyTemp[i] = Math.round((((jsonData['daily'][(i+1).toString()]['temp']['day'] - 273.15) * 9) / 5) + 32)
    }  } else if (unit=="C") {
      for (i = 0; i < dailyTemp.length; i++) {
        dailyTemp[i] = Math.round(jsonData['daily'][(i+1).toString()]['temp']['day'] - 273.15)
      }
  }
  chart.update();  
}

function createChart(){
setDailyLabel()
setDailyTemp()
chart.update()
ctx.style.display = "inline";
}

var data = {
  labels: dailyLabel,
  datasets: [
    {
      label: "Temperature",
      data: dailyTemp,
      backgroundColor: "blue",
      borderColor: "lightblue",
      fill: false,
      lineTension: 0,
      radius: 5
    }

  ]
};

//options
var options = {
  responsive: true,
  title: {
    display: true,
    position: "top",
    text: chartTitle,
    fontSize: 18,
    fontColor: "#111"
  },
  legend: {
    display: false},
  scales: {
    yAxes: [{
      scaleLabel: {
        display: true,
        labelString: yAxesLabel,
        precision: 0,
      }
    }]
  }
};

//create Chart class object
ctx = document.getElementById("line-chart");
ctx.style.display = "none";
var chart = new Chart(ctx, {
  type: "line",
  data: data,
  options: options
});