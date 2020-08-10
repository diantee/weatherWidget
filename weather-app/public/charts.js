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

var hourlyLabel = new Array(23);
var hourlyTemp = new Array(23);

function setDailyLabel () {
  for (i = 0; i < dailyLabel.length; i++) {
    dayInfo = new Date (jsonData['daily'][(i+1).toString()]['dt'] * 1000)
    dailyLabel[i] = [
      dayInfo.toLocaleDateString('en-US', {weekday: 'long'}),
      dayInfo.toLocaleDateString('en-US')
    ]
  }
}

function setHourlyLabel () {
  for (i = 0; i < hourlyLabel.length; i++) {
    /*if (i % 2 == 1){
    hourlyInfo = new Date (jsonData['hourly'][(i).toString()]['dt'] * 1000)
    hourlyLabel[i] = [
      hourlyInfo.toLocaleTimeString([], { hour: '2-digit'}),
      hourlyInfo.toLocaleDateString('en-US', {month: 'short', day: 'numeric' })
    ]}
    else {
      hourlyLabel[i] = ""
    }*/

    hourlyInfo = new Date (jsonData['hourly'][(i+1).toString()]['dt'] * 1000)
    hourlyLabel[i] = [
    hourlyInfo.toLocaleTimeString([], { hour: '2-digit'}),
    hourlyInfo.toLocaleDateString('en-US', {month: 'short', day: 'numeric' })
    ]
}}

function setTitle () {
  if (chartTitle == "Daily Forecast") {
    chartTitle = "Hourly Forecast"
  } 
  else {
    chartTitle = "Daily Forecast"
  }
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
    }
  } else if (unit=="C") {
      for (i = 0; i < dailyTemp.length; i++) {
        dailyTemp[i] = Math.round(jsonData['daily'][(i+1).toString()]['temp']['day'] - 273.15)
      }
  }
  chart.data.datasets['0'].data = dailyTemp
  chart.options.scales.xAxes[0].ticks.callback = function(tick, index, array) {return (index % 1) ? "" : tick;}
}

function setHourlyTemp (unit="F") {
  if (unit=="F") {
    for (i = 0; i < hourlyTemp.length; i++) {
      hourlyTemp[i] = Math.round((((jsonData['hourly'][(i+1).toString()]['temp']- 273.15) * 9) / 5) + 32)
    }  
  } else if (unit=="C") {
    for (i = 0; i < hourlyTemp.length; i++) {
      hourlyTemp[i] = Math.round(jsonData['hourly'][(i+1).toString()]['temp'] - 273.15)
    }
  }
  chart.data.datasets['0'].data = hourlyTemp
  chart.options.scales.xAxes[0].ticks.callback = function(tick, index, array) {return (index % 2) ? "" : tick;}
}

function createChart(){
  setDailyLabel()
  setDailyTemp()
  chart.update()
  ctx.style.display = "inline";
  document.getElementById("forecastButton").style.visibility="visible";
  document.getElementById("tempButton").style.visibility="visible";

}

function switchChart () {
  if (typeof jsonData === "undefined") {
    void(0)
  }
  else if (yAxesLabel == "Temperature (°F)"){
    if (chart.options.title.text == "Daily Forecast") {
      chart.options.title.text = "Hourly Forecast"
      chart.data.labels = hourlyLabel
      setHourlyLabel()
      setHourlyTemp("F")
      } 
    else if (chart.options.title.text == "Hourly Forecast") {
      chart.options.title.text = "Daily Forecast"
      chart.data.labels = dailyLabel
      setDailyLabel()
      setDailyTemp("F")
      }}
  
  else if (yAxesLabel == "Temperature (°C)"){
    if (chart.options.title.text == "Daily Forecast") {
      chart.options.title.text = "Hourly Forecast"
      chart.data.labels = hourlyLabel
      setHourlyLabel()
      setHourlyTemp("C")
    } 
    else if (chart.options.title.text == "Hourly Forecast") {
      chart.options.title.text = "Daily Forecast"
      chart.data.labels = dailyLabel
      setDailyLabel()
      setDailyTemp("C")
    }}
  chart.update();
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