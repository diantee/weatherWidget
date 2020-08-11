const searchElement = document.querySelector('[data-city-search')
const searchBox = new google.maps.places.SearchBox(searchElement)
searchBox.addListener('places_changed', () => {
    const place = searchBox.getPlaces()[0]
    if (place == null) return
    const latitude = place.geometry.location.lat()
    const longitude = place.geometry.location.lng()
    fetch('/weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
            latitude: latitude,
            longitude: longitude
        })
    }).then(res => res.json()).then(data => {
      console.log(data)
      setWeatherData(data, place.formatted_address)
    })
})

const icon = document.getElementById('weather-icon')
const locationElement = document.querySelector('[data-location]')
const statusElement  = document.querySelector('[data-status]')
const temperatureElement = document.querySelector('[data-temperature]')
const humidityElement = document.querySelector('[data-humidity]')
const uvElement = document.querySelector('[data-uv]')
const windElement = document.querySelector('[data-wind]')
var kelvinTemp
var jsonData
var initChart = false

function setWeatherData(data, place) {
  jsonData = data;
  kelvinTemp = data.current.temp
  locationElement.textContent = place
  statusElement.textContent = data['current']['weather']['0']['description']
  humidityElement.textContent = Math.round(data.current.humidity) + " %"
  uvElement.textContent = Math.round(data.current.uvi)
  windElement.textContent = Math.round(data.current.wind_speed) + " mph"
  icon.innerHTML = "<img src=\"https://openweathermap.org/img/wn/" + data['current']['weather']['0']['icon'] + "@2x.png\">"
  if (initChart == false) {
    temperatureElement.textContent = Math.round((((kelvinTemp - 273.15) * 9) / 5) + 32) + "°F"
    document.getElementById("tempButton").value="Convert to °C"
    initChart = !initChart
    createChart();
  }
  else {
    convertTemp()
    UpdateChart(yAxesLabel.slice(-2)[0],chartTitle[0])
  }
}

function convertTemp () {
  var temp = kelvinTemp
  if (yAxesLabel.slice(-2)[0] == "F") {temp = Math.round((((temp - 273.15) * 9) / 5) + 32) + "°F"}
  else if (yAxesLabel.slice(-2)[0] == "C") {temp = Math.round(temp - 273.15) + "°C"}
  temperatureElement.textContent = temp
}

function toggleTemp () {
  if (document.getElementById("tempButton").value=="Convert to °C" && chartTitle == "Daily Forecast") {
    UpdateChart("C","D")
  }
  else if (document.getElementById("tempButton").value=="Convert to °C" && chartTitle == "Hourly Forecast") {
    UpdateChart("C","H")
  }
  else if (document.getElementById("tempButton").value=="Convert to °F" && chartTitle == "Daily Forecast") {
    UpdateChart("F","D")
  }
  else if (document.getElementById("tempButton").value=="Convert to °F" && chartTitle == "Hourly Forecast") {
    UpdateChart("F","H")
  }
  
  convertTemp()

  if (document.getElementById("tempButton").value=="Convert to °F") {
    document.getElementById("tempButton").value="Convert to °C"
  }
  else if (document.getElementById("tempButton").value=="Convert to °C") {
    document.getElementById("tempButton").value="Convert to °F"
  }
  }