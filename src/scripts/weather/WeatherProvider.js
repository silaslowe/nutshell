// authored by kyle simmons. grabs weather info from open weather api and grabs lat and lng from graphhopper
import { keys } from '../../Settings.js'

let weather = {}

export const useWeather = () => weather
// grabs weather from the open weather api
export const getWeather=(lat, lng)=>
{
    return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=imperial&exclude=current,minutely,hourly&appid=${keys.weatherKey}`, {
        method: "GET"
    })
    .then(response=>response.json())
    .then(parsedWeather=>{
        Object.assign(weather,parsedWeather)
    })
}
// grabbing info from the graphhopper api so all thats needed to pass in for a 5 day forecast is a city name and state code
let location = []
export const getGeocode =(city, statecode)=>{
    return fetch(`https://graphhopper.com/api/1/geocode?q=${city},${statecode}&locale=us&debug=true&key=e2ca9f7a-3d59-4961-8590-d1e6d3e5c8f1`, {
        method: "Get"
    })
    .then(response=>response.json())
    .then(parsedLocation=>{
        location=parsedLocation.hits
    })
}

export const useGeocode = () => location.slice()


