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
const statusElement = document.querySelector('[data-status]')
const temperatureElement = document.querySelector('[data-temperature]')
const humidityElement = document.querySelector('[data-humidity]')
const uvElement = document.querySelector('[data-uv]')
const windElement = document.querySelector('[data-wind]')

function setWeatherData(data, place) {
  locationElement.textContent = place
  statusElement.textContent = data.current.weather.main
  temperatureElement.textContent = data.current.temp
  humidityElement.textContent = data.current.humidity
  uvElement.textContent = data.current.uvi
  windElement.textContent = data.current.wind_speed
  //const iconID = data['current']['weather']['0']['icon']
  //icon.innerHTML = "<img src=\"http://openweathermap.org/img/wn/" + iconID + "@2x.png\">"
  icon.innerHTML = "<img src=\"http://openweathermap.org/img/wn/" + data['current']['weather']['0']['icon'] + "@2x.png\">"
  
}