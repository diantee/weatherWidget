// Initializes components of daily/hourly forecast charts
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

/* Sets the x-axis labels of the forecast charts. 
Parameter is the initial letter of the forecast chart type: "H" for Hourly chart, or "D" for Daily chart.
Does not return anything.*/
function setLabel (forecast){
  if (forecast=="D") {
    for (i = 0; i < dailyLabel.length; i++) {
      dayInfo = new Date (jsonData['daily'][(i+1).toString()]['dt'] * 1000)
      dailyLabel[i] = [
        dayInfo.toLocaleDateString('en-US', {weekday: 'long'}),
        dayInfo.toLocaleDateString('en-US')
      ]}
    chart.data.labels = dailyLabel
  }
  if (forecast=="H") {
    for (i = 0; i < hourlyLabel.length; i++) {
      hourlyInfo = new Date (jsonData['hourly'][(i+1).toString()]['dt'] * 1000)
      hourlyLabel[i] = [
      hourlyInfo.toLocaleTimeString([], { hour: '2-digit'}),
      hourlyInfo.toLocaleDateString('en-US', {month: 'short', day: 'numeric' })
      ]}
    chart.data.labels = hourlyLabel
  }
}

/* Sets the temperature data to the relevant dataset array. 
Parameter 1 is the initial letter of the temperature unit: "F" for Fahrenheit, or "C" for Celsius.
Parameter 2 is the initial letter of the forecast chart type: "H" for Hourly chart, or "D" for Daily chart.
Does not return anything.*/
function setTemp (unit,forecast){
  if (forecast=="D") {
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

  else if (forecast=="H"){
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
}

/* Sets the forecast chart title. 
Parameter is the initial letter of the forecast chart type: "H" for Hourly chart, or "D" for Daily chart.
Does not return anything.*/
function setTitle (forecast) {
  if (forecast == "D") {chartTitle = "Daily Forecast"} 
  else if (forecast == "H") {chartTitle = "Hourly Forecast"} 
  chart.options.title.text = chartTitle;}

/* Sets the y-axis label of the forecast charts. 
Parameter is the initial letter of the temperature unit: "F" for Fahrenheit, or "C" for Celsius.
Does not return anything.*/
function setyAxesLabel(unit) {
  if (unit=="F") {yAxesLabel = "Temperature (°F)"} 
  else if (unit=="C") {yAxesLabel = "Temperature (°C)"}
  chart.options.scales.yAxes['0'].scaleLabel.labelString = yAxesLabel;}

/* Populates the Chart object and makes it visible. Function is only called once, when the first location is entered.
Does not return anything.*/  
function createChart(){
  UpdateChart("F","D")
  ctx.style.display = "inline";
  document.getElementById("forecastButton").style.visibility="visible";
  document.getElementById("tempButton").style.visibility="visible";
}

/* Updates the components of the chart. 
Parameter 1 is the initial letter of the temperature unit: "F" for Fahrenheit, or "C" for Celsius.
Parameter 2 is the initial letter of the forecast chart type: "H" for Hourly chart, or "D" for Daily chart.
Does not return anything.*/
function UpdateChart (unit,forecast) {
  setLabel(forecast)
  setTemp(unit,forecast)
  setTitle(forecast)
  setyAxesLabel(unit)
  chart.update();
}

/* Toggles the temperature units between Fahrenheit or Celsius.
Does not return anything.*/
function toggleForecast () {
  if (yAxesLabel == "Temperature (°F)" && chartTitle == "Daily Forecast"){
    UpdateChart("F","H")
    }
  else if (yAxesLabel == "Temperature (°F)" && chartTitle == "Hourly Forecast"){
    UpdateChart("F","D")
    }
  else if (yAxesLabel == "Temperature (°C)" && chartTitle == "Daily Forecast"){
    UpdateChart("C","H")
    }
  else if (yAxesLabel == "Temperature (°C)" && chartTitle == "Hourly Forecast"){
    UpdateChart("C","D")
    }
 
  if (document.getElementById("forecastButton").value=="Switch to Daily Forecast") {
    document.getElementById("forecastButton").value="Switch to Hourly Forecast"
  }
  else if (document.getElementById("forecastButton").value=="Switch to Hourly Forecast") {
    document.getElementById("forecastButton").value="Switch to Daily Forecast"
  }
}

// Chart data
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

// Chart options
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

// Create Chart class object
ctx = document.getElementById("line-chart");
ctx.style.display = "none";
var chart = new Chart(ctx, {
  type: "line",
  data: data,
  options: options
});