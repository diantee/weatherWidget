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

function setWeatherData(data, place) {
  jsonData = data;
  kelvinTemp = data.current.temp
  locationElement.textContent = place
  statusElement.textContent = data['current']['weather']['0']['description']
  temperatureElement.textContent = Math.round((((kelvinTemp - 273.15) * 9) / 5) + 32) + "°F"
  document.getElementById("tempButton").value="Convert to °C"
  humidityElement.textContent = Math.round(data.current.humidity) + " %"
  uvElement.textContent = Math.round(data.current.uvi)
  windElement.textContent = Math.round(data.current.wind_speed) + " mph"
  icon.innerHTML = "<img src=\"http://openweathermap.org/img/wn/" + data['current']['weather']['0']['icon'] + "@2x.png\">"
  createChart();
}

function toggleTemp () {
  var temp = kelvinTemp

  if (document.querySelector('[data-temperature]').innerHTML=='- -') {
    void(0)
    }
  else if (document.getElementById("tempButton").value=="Convert to °C") {
    temp = Math.round(temp - 273.15) + "°C"
    setyAxesLabel("C")
    if (chart.options.title.text == "Daily Forecast") {
      setDailyTemp("C")
    } 
    else if (chart.options.title.text == "Hourly Forecast") {
      setHourlyTemp("C")
    }
    document.getElementById("tempButton").value="Convert to °F"
    temperatureElement.textContent = temp
    
  } else if (document.getElementById("tempButton").value=="Convert to °F") {
    temp = Math.round((((temp - 273.15) * 9) / 5) + 32) + "°F"
    setyAxesLabel("F")
    if (chart.options.title.text == "Daily Forecast") {
      setDailyTemp("F")
    } 
    else if (chart.options.title.text == "Hourly Forecast") {
      setHourlyTemp("F")
    }
    document.getElementById("tempButton").value="Convert to °C"
    temperatureElement.textContent = temp
  }
  console.log(yAxesLabel)
  chart.update()
  }
