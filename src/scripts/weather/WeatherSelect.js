// authored by kyle simmons. two functions to show either the projected weather for nashville, or a city after a user selects show weather on the events tab

import { getWeather, useWeather, getGeocode, useGeocode } from "./WeatherProvider.js"


export const defaultWeather = () => {
    // pass in city name and state code as strings to the geocode api to return lat and lng points
    getGeocode("nashville", "tn").then(() => {
        // setting the geocode to an array
        const locationArray = useGeocode()
        // lat point
        const locationLat = locationArray[0].point.lat
        // lng point
        const locationLng = locationArray[0].point.lng
        // pass in lat and lng into the get weather function
        getWeather(locationLat, locationLng).then(() => {
            // that ur html target
            const htmlTarget = document.querySelector(".weatherBox")
            // current weather array for nashville 
            const nashWeather = useWeather()
            // setting title class to target
            const h4Target = document.querySelector(".h4Nashville")
            // 5 day weather array
            const fiveDayWeather = nashWeather.daily.slice(0, 5)
            // setting only one day to return
            let weatherArr = [];
            for( let i = 0; i < 1; i++ ) {
                weatherArr.push(fiveDayWeather[i]);
            }
            // map thru weather array and build html
            const weatherHTML = weatherArr.map(day => {
                // multiply timestamp by 1000
                const datept1 = day.dt * 1000
                // built in function to convert new string to readable date
                const humanDate = new Date(datept1)
                // converting readable date to american metric for date
                const condensedDate = humanDate.toLocaleDateString("en-US", {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric"
                })
                // variable for the high for that day
                const high = Math.floor(day.temp.max)
                // variable for the low for that day
                const low = Math.floor(day.temp.min)
                // variable for the projected weather for that day
                const precip = day.weather[0].description
                // variable for the icon based off of the projected weather/time
                const iconAddress = `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`
                // build out the string based off of the given html
                return `
                <div class="weatherDay">
                <div >
                <img class="weatherIcon" src="${iconAddress}">
                </div>
                <p class="date">${condensedDate}</p>
                <p class="highTemp">High: ${high}&#8457;</p>
                <p class="lowTemp">Low: ${low}&#8457;</p>
                <p class="rainCondition">${precip}</p>
                </div>
                `
            }).join("")
            h4Target.innerHTML = `<h4>Nashville Forecast</h4>`
            htmlTarget.innerHTML = weatherHTML
        })
    })
    }
// same thing just passing in a city and state
export const eventWeather = (city, state, date) => {
    getGeocode(city, state).then(() => {
        if(!date)
            date = 0;
        if(date > 7)
            date = 0;

        console.log(date)
        const locationArray = useGeocode()
        const locationLat = locationArray[0].point.lat
        const locationLng = locationArray[0].point.lng
        getWeather(locationLat, locationLng).then(() => {
            const htmlTarget = document.querySelector(".weatherBox")
            const nashWeather = useWeather()
            const h4Target = document.querySelector(".h4Nashville")
            const fiveDayWeather = nashWeather.daily.slice(0, 8)
            let weatherArr = [];
            weatherArr.push(fiveDayWeather[date])
            const weatherHTML = weatherArr.map(day => {
                const datept1 = day.dt * 1000
                const humanDate = new Date(datept1)
                const condensedDate = humanDate.toLocaleDateString("en-US", {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric"
                
                })
                
                const high = Math.floor(day.temp.max)
                const low = Math.floor(day.temp.min)
                const precip = day.weather[0].description
                const iconAddress = `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`
                return `
                <div class="weatherDay">
                <div >
                <img class="weatherIcon" src="${iconAddress}">
                </div>
                <p class="date">${condensedDate}</p>
                <p class="highTemp">High: ${high}&#8457;</p>
                <p class="lowTemp">Low: ${low}&#8457;</p>
                <p class="rainCondition">${precip}</p>
                </div>
                `
            }).join("")
            h4Target.innerHTML = `<h4>${city} Forecast</h4>`
            htmlTarget.innerHTML = weatherHTML
        })
    })
    }
    